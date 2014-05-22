<?php

namespace Craft;

class Stow_CacheRecord extends BaseRecord
{
    public function getTableName()
    {
        return 'stow_cache';
    }

    public function defineAttributes()
    {
        return array(
            'key'           => AttributeType::String,
            'hash'          => array(AttributeType::String, 'required' => true, 'unique' => true),
            'url'           => AttributeType::String,
            'cachedContent' => array('type' => AttributeType::String, 'column' => 'mediumtext')
        );
    }
}
