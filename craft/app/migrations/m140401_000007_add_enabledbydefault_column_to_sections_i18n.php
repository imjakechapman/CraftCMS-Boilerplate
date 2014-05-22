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
class m140401_000007_add_enabledbydefault_column_to_sections_i18n extends BaseMigration
{
	/**
	 * Any migration code in here is wrapped inside of a transaction.
	 *
	 * @return bool
	 */
	public function safeUp()
	{
		if (!craft()->db->columnExists('sections_i18n', 'enabledByDefault'))
		{
			$this->addColumnAfter('sections_i18n', 'enabledByDefault', array('column' => ColumnType::Bool, 'default' => 1), 'locale');
			Craft::log('Successfully added the sections_i18n.enabledByDefault column.', LogLevel::Info, true);
		}
		else
		{
			Craft::log('The sections_i18n.enabledByDefault column already exists.', LogLevel::Info, true);
		}

		return true;
	}
}
