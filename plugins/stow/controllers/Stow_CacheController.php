<?php

namespace Craft;

class Stow_CacheController extends BaseController
{
    public function actionDelete()
    {
        $id = craft()->request->getRequiredParam('id');

        if (craft()->stow->deleteCacheById($id)) {
            craft()->userSession->setNotice(Craft::t('Cache deleted.'));
        }
        else  {
            craft()->userSession->setError(Craft::t("Couldn't delete cache."));
        }

        $this->redirect($_SERVER['HTTP_REFERER']);
    }
}
