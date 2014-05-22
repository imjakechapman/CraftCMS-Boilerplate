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
class m140508_000000_fix_disabled_matrix_blocks extends BaseMigration
{
	/**
	 * Any migration code in here is wrapped inside of a transaction.
	 *
	 * @return bool
	 */
	public function safeUp()
	{
		// Get all known Matrix block IDs
		$matrixBlockIds = craft()->db->createCommand()
			->select('id')
			->from('elements')
			->where('type = "MatrixBlock"')
			->queryColumn();

		if ($matrixBlockIds)
		{
			// Make sure each of them are enabled across all locales
			$this->update('elements_i18n', array('enabled' => '1'), array('in', 'elementId', $matrixBlockIds));
		}

		return true;
	}
}
