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
class AssetTransformIndexModel extends BaseModel
{
	/**
	 * Use the folder name as the string representation.
	 *
	 * @return string
	 */
	function __toString()
	{
		return $this->id;
	}

	/**
	 * @return array
	 */
	protected function defineAttributes()
	{
		return array(
			'id'           => AttributeType::Number,
			'fileId'       => AttributeType::Number,
			'location'     => AttributeType::String,
			'sourceId'     => AttributeType::Number,
			'fileExists'   => AttributeType::Bool,
			'inProgress'   => AttributeType::Bool,
			'dateIndexed'  => AttributeType::DateTime,
			'dateUpdated'  => AttributeType::DateTime,
			'dateCreated'  => AttributeType::DateTime,
		);
	}
}
