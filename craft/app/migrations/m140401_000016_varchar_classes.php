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
class m140401_000016_varchar_classes extends BaseMigration
{
	/**
	 * Any migration code in here is wrapped inside of a transaction.
	 *
	 * @return bool
	 */
	public function safeUp()
	{
		$classCols = array(
			array('assetsources', 'type'),
			array('elements', 'type'),
			array('fieldlayouts', 'type'),
			array('fields', 'type'),
			array('plugins', 'class'),
			array('tasks', 'type'),
			array('widgets', 'type'),
		);

		foreach ($classCols as $col)
		{
			$this->alterColumn($col[0], $col[1], array('column' => ColumnType::Varchar, 'maxLength' => 150, 'null' => false));
		}

		return true;
	}
}
