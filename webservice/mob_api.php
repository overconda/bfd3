<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methodhs: GET, POST, PUT');

require_once 'database.php';

/**
 * SBF API Class
 * 
 */
class SBF_API {

    public $database;

    /**
     * Construction
     */
    public function __construct() {
        $this->database = new Database();
    }

    /**
     * Get bases and user info with route
     * @param type $route_id
     * @param type $oauth_user_id
     * @return type
     */
    public function getRouteBaseUser($route_id, $oauth_user_id) {
        $data = array("route" => NULL, "base" => array(), "user_route" => NULL, "user_base" => array());

        // get route info
        $result = $this->database->query("SELECT * FROM sbfdm_route WHERE ID={$route_id}");
        if ($result->num_rows) {
            $row = $result->fetch_assoc();
            $data["route"] = $row;
        }

        // get base info
        $result = $this->database->query("SELECT * FROM sbfdm_route_base WHERE route_id={$route_id}");
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $data["base"][] = $row;
            }
        }

        // get route user info
        $result = $this->database->query("SELECT * FROM sbfdm_user_route WHERE route_id={$route_id} AND oauth_user_id='{$oauth_user_id}'");
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $data["user_route"] = $row;
            }
        }

        // get base user info
        $result = $this->database->query("SELECT * FROM sbfdm_user_base WHERE route_id={$route_id} AND oauth_user_id='{$oauth_user_id}'");
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $data["user_base"][] = $row;
            }
        }

        return $data;
    }

    /**
     * Get base and user relation info with base
     * @param type $base_id
     * @param type $oauth_user_id
     * @return type
     */
    public function getBaseUser($base_id, $oauth_user_id) {
        $data = array("base" => NULL, "user_base" => NULL);

        // get base info
        $result = $this->database->query("SELECT * FROM sbfdm_route_base WHERE ID={$base_id}");
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $data["base"] = $row;
            }
        }

        // get base user info
        $result = $this->database->query("SELECT * FROM sbfdm_user_base WHERE base_id={$base_id} AND oauth_user_id='{$oauth_user_id}'");
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $data["user_base"] = $row;
            }
        }

        // check wait time - unlock-wait, challeng-wait
        if ($data["user_base"] != NULL) {
            $today_time = strtotime(date("Y-m-d H:i:s"));
            $data["user_base"]["unlock_time"] = 0;
            $data["user_base"]["challenge_time"] = 0;

            if ($data["user_base"]["unlock_wait_time"] !== NULL) {
                $wait_time = strtotime($data["user_base"]["unlock_wait_time"]);
                $data["user_base"]["unlock_time"] = round(($today_time - $wait_time) / 60, 1);
            }

            if ($data["user_base"]["challenge_wait_time"] !== NULL) {
                $wait_time = strtotime($data["user_base"]["challenge_wait_time"]);
                $data["user_base"]["challenge_time"] = round(($today_time - $wait_time) / 60, 1);
            }
        }

        $data["base"]["guardian"] = NULL;
        if ($data["base"]["latest_guardian_oauth_user_id"] !== NULL) {
            $result = $this->database->query("SELECT * FROM sbfdm_oauth WHERE oauth_user_id='{$data["base"]["latest_guardian_oauth_user_id"]}'");
            if ($result->num_rows) {
                while ($row = $result->fetch_assoc()) {
                    $data["base"]["guardian"] = $row;
                }
            }
        }

        $data["route"] = NULL;
        $result = $this->database->query("SELECT * FROM sbfdm_route WHERE ID={$data["base"]["route_id"]}");
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $data["route"] = $row;
            }
        }

        return $data;
    }

    /**
     * Get nearby bases with lat,lon
     * @param type $latitude
     * @param type $longitude
     * @return type
     */
    public function getNearbyRouteBase($latitude, $longitude) {
        $radius = 50.0;
        $distance_unit = 111.045;
        $data = array("nearby_base" => NULL);
        $sql = 'SELECT *
            FROM (
                SELECT z.ID,z.route_id,z.base_no,z.base_title,z.base_latitude, z.base_longitude,
                    p.radius,
                    p.distance_unit
                 * DEGREES(ACOS(COS(RADIANS(p.latpoint))
                 * COS(RADIANS(z.base_latitude))
                 * COS(RADIANS(p.longpoint - z.base_longitude))
                 + SIN(RADIANS(p.latpoint))
                 * SIN(RADIANS(z.base_latitude)))) AS distance
                    FROM sbfdm_route_base AS z
                    JOIN (
                        SELECT  ' . $latitude . '  AS latpoint,  ' . $longitude . ' AS longpoint,
                        ' . $radius . ' AS radius, ' . $distance_unit . ' AS distance_unit
                    ) AS p ON 1=1
                WHERE 
                    z.base_latitude BETWEEN p.latpoint  - (p.radius / p.distance_unit) 
                    AND p.latpoint  + (p.radius / p.distance_unit)
                AND 
                    z.base_longitude BETWEEN p.longpoint - (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint)))) 
                    AND p.longpoint + (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint))))
            ) AS d
            WHERE distance <= radius
            ORDER BY distance';

        $result = $this->database->query($sql);
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $data["nearby_base"][] = $row;
            }
        }
        return $data;
    }

    /**
     * Get unlocked base quiz
     * @param type $oauth_user_id
     * @return type
     */
    public function getBaseUnlockQuiz($oauth_user_id) {
        $data = array("quiz" => NULL);
        $result = $this->database->query("SELECT * FROM sbfdm_quiz WHERE category=1 ORDER BY RAND() LIMIT 1");
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                //unset($row["category"]);
                //unset($row["correct_answer"]); || for test only
                $data["quiz"] = $row;
            }
        }
        return $data;
    }

    /**
     * Check unlocked base quiz & answer
     * @param type $route_id
     * @param type $base_id
     * @param type $base_no
     * @param type $oauth_user_id
     * @param type $quiz_id
     * @param type $answer
     * @return string
     */
    public function checkBaseUnlockQuiz($route_id, $base_id, $base_no, $oauth_user_id, $quiz_id, $answer) {
        // prevent hack 
        $data = array("correct" => 'false');
        $quiz = NULL;

        $result = $this->database->query("SELECT * FROM sbfdm_quiz WHERE ID='{$quiz_id}' LIMIT 1");
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $quiz = $row;
            }
        }

        // base unlock successful
        $unlocked_status = 'false';
        $unlocked_date = NULL;
        $unlock_wait_time = NULL;

        if ($quiz['correct_answer'] == $answer) {
            $data["correct"] = 'true';
            $unlocked_status = 'true';
            $time = new DateTime();
            $unlocked_date = $time->format('Y-m-d H:i');
        } else {
            $time = new DateTime();
            $minutes_to_add = 3;
            $time->add(new DateInterval('PT' . $minutes_to_add . 'M'));
            $unlock_wait_time = $time->format('Y-m-d H:i');
        }

        $field = array(
            'oauth_user_id' => $oauth_user_id,
            'route_id' => $route_id,
            'base_id' => $base_id,
            'base_no' => $base_no,
            'unlocked_status' => $unlocked_status,
            'unlocked_date' => $unlocked_date,
            "unlock_wait_time" => $unlock_wait_time,
        );

        $result = $this->database->query("SELECT * FROM sbfdm_user_base WHERE oauth_user_id='{$oauth_user_id}' AND base_id='{$base_id}' LIMIT 1");
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $set = "";
            $index = 0;
            foreach ($field as $key => $value) {
                $set .= "{$key}='{$value}'";
                $index++;
                if ($index < count($field)) {
                    $set.=",";
                }
            }
            $sql = "UPDATE sbfdm_user_base SET {$set} WHERE ID='{$row["ID"]}'";
        } else {
            $key = implode(",", array_keys($field));
            $value = "'" . implode("','", array_values($field)) . "'";
            $sql = "INSERT INTO sbfdm_user_base({$key}) VALUES({$value})";
        }
        $result = $this->database->query($sql);

        return $data;
    }

    /**
     * Get base challenge quiz
     * @param type $oauth_user_id
     * @return type
     */
    public function getBaseChallengeQuiz($oauth_user_id) {
        $data = array("quiz" => NULL);
        $result = $this->database->query("SELECT * FROM sbfdm_quiz WHERE category!=1 ORDER BY RAND() LIMIT 1");
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                //unset($row["category"]);
                //unset($row["correct_answer"]); || for test only
                $data["quiz"] = $row;
            }
        }
        return $data;
    }

    /**
     * Check base challenge quiz and answer
     * @param type $route_id
     * @param type $base_id
     * @param type $base_no
     * @param type $oauth_user_id
     * @param type $quiz_id
     * @param type $answer
     * @return string
     */
    public function checkBaseChallengeQuiz($route_id, $base_id, $base_no, $oauth_user_id, $quiz_id, $answer) {
        // prevent hack 
        $data = array("correct" => 'false');
        $quiz = NULL;
        $result = $this->database->query("SELECT * FROM sbfdm_quiz WHERE ID='{$quiz_id}' LIMIT 1");
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $quiz = $row;
            }
        }
        // base challenge        
        if ($quiz['correct_answer'] == $answer) {
            $data["correct"] = 'true';
        } else {
            $time = new DateTime();
            $minutes_to_add = 3;
            $time->add(new DateInterval('PT' . $minutes_to_add . 'M'));
            $challenge_wait_time = $time->format('Y-m-d H:i');
            $sql = "UPDATE sbfdm_user_base SET challenge_wait_time='$challenge_wait_time' WHERE oauth_user_id='{$oauth_user_id}' AND base_id='{$base_id}'";
            $result = $this->database->query($sql);
        }
        return $data;
    }

    /**
     * Check base challenge win or lose
     * @param type $base_id
     * @param type $oauth_user_id
     * @param type $score
     */
    public function setBaseUser($base_id, $oauth_user_id, $score) {
        $challenge = 'lose';
        $result = $this->database->query("SELECT * FROM sbfdm_route_base WHERE ID='{$base_id}' LIMIT 1");
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if ($score > $row['latest_guardian_score']) {
                $challenge = 'win';
                $field = array(
                    'latest_guardian_score' => $score,
                    'latest_guardian_oauth_user_id' => $oauth_user_id,
                    'latest_guardian_date' => date('Y-m-d H:i:s'),
                );

                $set = "";
                $index = 0;

                foreach ($field as $key => $value) {
                    $set .= "{$key}='{$value}'";
                    $index++;
                    if ($index < count($field)) {
                        $set.=",";
                    }
                }
                $sql = "UPDATE sbfdm_route_base SET {$set} WHERE ID='$base_id}'";
                $this->database->query($sql);
            }
        }

        // user_base
        if ($challenge == 'win') {
            $sql = "UPDATE sbfdm_user_base SET guardian_status='false' WHERE base_id='$base_id}'";
            $this->database->query($sql);
            $field = array(
                'guardian_status' => 'true',
                'guardian_score' => $score,
                'guardian_start_date' => date('Y-m-d H:i:s'),
            );
            $set = "";
            $index = 0;
            foreach ($field as $key => $value) {
                $set .= "{$key}='{$value}'";
                $index++;
                if ($index < count($field)) {
                    $set.=",";
                }
            }
            $time = new DateTime();
            $minutes_to_add = 3;
            $time->add(new DateInterval('PT' . $minutes_to_add . 'M'));
            $challenge_wait_time = $time->format('Y-m-d H:i');
            $sql = "UPDATE sbfdm_user_base SET {$set},challenge_wait_time='{$challenge_wait_time}' WHERE base_id='$base_id}' AND oauth_user_id='{$oauth_user_id}'";
            $this->database->query($sql);
        } else {
            $time = new DateTime();
            $minutes_to_add = 3;
            $time->add(new DateInterval('PT' . $minutes_to_add . 'M'));
            $challenge_wait_time = $time->format('Y-m-d H:i');
            $sql = "UPDATE sbfdm_user_base SET challenge_wait_time='{$challenge_wait_time}' WHERE base_id='$base_id}' AND oauth_user_id='{$oauth_user_id}'";
            $this->database->query($sql);
        }
    }

}

/**
 * Main Program
 */
$sbf_api = new SBF_API();

if ($_POST['method'] == "get_route_base_user") {
    $response = $sbf_api->getRouteBaseUser($_POST['route_id'], $_POST['oauth_user_id']);
    header('Content-Type: application/json');
    echo(json_encode($response));
} else if ($_POST['method'] == "get_base_user") {
    $response = $sbf_api->getBaseUser($_POST['base_id'], $_POST['oauth_user_id']);
    header('Content-Type: application/json');
    echo(json_encode($response));
} else if ($_POST['method'] == "get_nearby_route_base") {
    $response = $sbf_api->getNearbyRouteBase($_POST['sbf_current_gps']['latitude'], $_POST['sbf_current_gps']['longitude']);
    header('Content-Type: application/json');
    echo(json_encode($response));
} else if ($_POST['method'] == "get_base_unlock_quiz") {
    $response = $sbf_api->getBaseUnlockQuiz($_POST['oauth_user_id']);
    header('Content-Type: application/json');
    echo(json_encode($response));
} else if ($_POST['method'] == "check_base_unlock_quiz") {
    $response = $sbf_api->checkBaseUnlockQuiz($_POST['route_id'], $_POST['base_id'], $_POST['base_no'], $_POST['oauth_user_id'], $_POST['quiz_id'], $_POST['answer']);
    header('Content-Type: application/json');
    echo(json_encode($response));
} else if ($_POST['method'] == "get_base_challenge_quiz") {
    $response = $sbf_api->getBaseChallengeQuiz($_POST['oauth_user_id']);
    header('Content-Type: application/json');
    echo(json_encode($response));
} else if ($_POST['method'] == "check_base_challenge_quiz") {
    $response = $sbf_api->checkBaseChallengeQuiz($_POST['route_id'], $_POST['base_id'], $_POST['base_no'], $_POST['oauth_user_id'], $_POST['quiz_id'], $_POST['answer']);
    header('Content-Type: application/json');
    echo(json_encode($response));
} else if ($_POST['method'] == "set_base_user") {
    $response = $sbf_api->setBaseUser($_POST['base_id'], $_POST['oauth_user_id'], $_POST['score']);
    header('Content-Type: application/json');
    echo(json_encode($response));
}



