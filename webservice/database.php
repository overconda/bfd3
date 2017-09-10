<?php

/**
 * Database Class
 * 
 */

define("SBF_DB_HOST", "localhost");
define("SBF_DB_USER", "pophonic_bfd2");
define("SBF_DB_PASSWORD", "BFD2db#2017");
define("SBF_DB_NAME", "pophonic_bfd2");

class Database {

    public $servername = SBF_DB_HOST;
    public $username = SBF_DB_USER;
    public $password = SBF_DB_PASSWORD;
    public $dbname = SBF_DB_NAME;
    public $conn;

    function __construct() {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
        $this->conn->query("SET CHARACTER SET utf8");
    }

    function insert($table, $fields = array()) {
        
    }

    function update($table, $fields = array(), $where = array()) {
        
    }

    function delete($table, $where = array()) {
        
    }

    function select($table, $where = array()) {
        
    }

    function query($sql, $return_data = FALSE) {
        $result = $this->conn->query($sql);
        if ($return_data) {
            $data = array("result" => $result);
            if ($result->num_rows > 0) {
                $data["data"] = $result->fetch_assoc();
            }
            return $data;
        } else {
            return $result;
        }
    }

}
