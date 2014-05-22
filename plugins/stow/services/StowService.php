<?php

/**
 * Stow
 *
 * @package     Stow
 * @version     Version 1.0
 * @author      Connor Smith
 * @copyright   Copyright (c) 2013
 * @link        sphinx.io
 *
 */

namespace Craft;

class StowService extends BaseApplicationComponent
{
    protected $cacheRecord;
    protected $cacheModel;

    public function __construct($cacheRecord = null)
    {
        $this->cacheRecord = new Stow_CacheRecord;
        $this->cacheModel = $this->cacheRecord->model();
    }

    public function saveCache($opts)
    {
        $model = new Stow_CacheRecord;
        $model->hash = $opts['hash'];
        $model->key = $opts['key'];
        $model->url = $opts['url'];
        $model->cachedContent = $opts['cachedContent'];
        $model->save();
    }

    public function fetchCache($hash)
    {
        $t = $this->fetchCacheByhash($hash);
        return ($t->id === NULL) ? FALSE : $t->cachedContent;
    }

    public function fetchCacheById($id)
    {
        return Stow_CacheModel::populateModel($this->cacheRecord->findByPk($id));
    }

    public function fetchCacheByhash($hash)
    {
        return Stow_CacheModel::populateModel($this->cacheRecord->findByAttributes(array('hash' => $hash)));
    }

    public function fetchAllCache()
    {
        return Stow_CacheModel::populateModels($this->cacheRecord->findAll());
    }

    public function deleteCacheById($id)
    {
        return $this->cacheRecord->deleteByPk($id);
    }

    public function deleteAllCache()
    {
        return $this->cacheRecord->deleteAll();
    }
}