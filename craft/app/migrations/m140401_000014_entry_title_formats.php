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
class m140401_000014_entry_title_formats extends BaseMigration
{
	/**
	 * Any migration code in here is wrapped inside of a transaction.
	 *
	 * @return bool
	 */
	public function safeUp()
	{
		if (!craft()->db->columnExists('entrytypes', 'hasTitleField'))
		{
			Craft::log('Adding hasTitleField column to entrytypes table.', LogLevel::Info, true);
			$this->addColumnAfter('entrytypes', 'hasTitleField', array('column' => ColumnType::Bool, 'null' => false, 'default' => 1), 'handle');

			Craft::log('Adding titleFormat column to entrytypes table.', LogLevel::Info, true);
			$this->addColumnAfter('entrytypes', 'titleFormat', array('column' => ColumnType::Varchar), 'titleLabel');
		}

		return true;
	}
}
