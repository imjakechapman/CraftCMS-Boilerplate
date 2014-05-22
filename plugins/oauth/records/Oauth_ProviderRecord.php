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

class Oauth_ProviderRecord extends BaseRecord
{
    /**
     * Get Table Name
     */
    public function getTableName()
    {
        return 'oauth_providers';
    }

    /**
     * Define Attributes
     */
    public function defineAttributes()
    {
        return array(
            'class' => array(AttributeType::String, 'required' => true),
            'clientId' => array(AttributeType::String, 'required' => false),
            'clientSecret' => array(AttributeType::String, 'required' => false)
        );
    }

    /**
     * @return array
     */
    public function defineIndexes()
    {
        return array(
            array('columns' => array('class'), 'unique' => true),
        );
    }
}