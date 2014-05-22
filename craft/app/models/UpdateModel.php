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
 * Stores all of the available update info.
 */
class UpdateModel extends BaseModel
{
	/**
	 * @access protected
	 * @return array
	 */
	protected function defineAttributes()
	{
		$attributes['app']      = array(AttributeType::Mixed, 'model' => 'AppUpdateModel');
		$attributes['plugins']  = AttributeType::Mixed;
		$attributes['errors']   = AttributeType::Mixed;

		return $attributes;
	}

	/**
	 * @param string $name
	 * @param mixed  $value
	 * @return bool|void
	 */
	public function setAttribute($name, $value)
	{
		if ($name == 'plugins')
		{
			$value = PluginUpdateModel::populateModels($value);
		}

		parent::setAttribute($name, $value);
	}
}
