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
 *
 */
class StructureModel extends BaseModel
{
	/**
	 * @access protected
	 * @return array
	 */
	protected function defineAttributes()
	{
		return array(
			'id'             => AttributeType::Number,
			'maxLevels'      => AttributeType::Number,
			'movePermission' => AttributeType::String,
		);
	}

	/**
	 * Returns whether elements in this structure can be sorted by the current user.
	 *
	 * @return bool
	 */
	public function isSortable()
	{
		return (!$this->movePermission || craft()->userSession->checkPermission($this->movePermission));
	}
}
