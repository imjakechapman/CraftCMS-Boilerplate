<?php
namespace Craft;

/**
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2014, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license Craft License Agreement
 * @link      http://buildwithcraft.com
 */

/**
 * The class name is the UTC timestamp in the format of mYYMMDD_HHMMSS_migrationName
 */
class m140401_000018_locale_routes extends BaseMigration
{
	/**
	 * Any migration code in here is wrapped inside of a transaction.
	 *
	 * @return bool
	 */
	public function safeUp()
	{
		if (!craft()->db->columnExists('routes', 'locale'))
		{
			$this->addColumnAfter('routes', 'locale', array('column' => 'locale'), 'id');
			$this->createIndex('routes', 'locale');
			$this->addForeignKey('routes', 'locale', 'locales', 'locale', 'CASCADE', 'CASCADE');
		}

		return true;
	}
}
