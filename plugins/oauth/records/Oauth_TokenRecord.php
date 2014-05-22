<?php

/**
 * Craft OAuth by Dukt
 *
 * @package   Craft OAuth
 * @author    Benjamin David
 * @copyright Copyright (c) 2014, Dukt
 * @license   https://dukt.net/craft/oauth/docs/license
 * @link      https://dukt.net/craft/oauth/
 */

namespace Craft;

class Oauth_TokenRecord extends BaseRecord
{
    /**
     * Get Table Name
     */
    public function getTableName()
    {
        return 'oauth_tokens';
    }

    /**
     * Define Attributes
     */
    public function defineAttributes()
    {
        return array(
            'userMapping' => array(AttributeType::String, 'required' => false),
            'namespace' => array(AttributeType::String, 'required' => false),
            'provider' => array(AttributeType::String, 'required' => true),
            'scope' => array(AttributeType::Mixed, 'required' => false),
            'token' => array(AttributeType::String, 'column' => ColumnType::Text),
        );
    }

    public function defineRelations()
    {
        return array(
            'user' => array(static::BELONGS_TO, 'UserRecord', 'onDelete' => static::CASCADE, 'required' => false),
        );
    }

    /**
     * @return array
     */
    public function defineIndexes()
    {
        return array(
            array('columns' => array('userMapping', 'provider'), 'unique' => true),
            array('columns' => array('userId', 'provider'), 'unique' => true),
            array('columns' => array('namespace', 'provider'), 'unique' => true)
        );
    }
}