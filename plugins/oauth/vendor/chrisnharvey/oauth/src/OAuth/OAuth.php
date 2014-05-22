<?php

namespace OAuth;

class OAuth
{
    public static function provider($class, array $params = array())
    {
        $class = "OAuth\\Provider\\{$class}";

        return new $class($params);
    }
}
