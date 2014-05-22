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
 * Category group locale model class
 */
class CategoryGroupLocaleModel extends BaseModel
{
	public $urlFormatIsRequired = false;
	public $nestedUrlFormatIsRequired = false;

	/**
	 * @access protected
	 * @return array
	 */
	protected function defineAttributes()
	{
		return array(
			'id'              => AttributeType::Number,
			'groupId'         => AttributeType::Number,
			'locale'          => AttributeType::Locale,
			'urlFormat'       => array(AttributeType::UrlFormat, 'label' => 'URL Format'),
			'nestedUrlFormat' => array(AttributeType::UrlFormat, 'label' => 'URL Format'),
		);
	}

	/**
	 * Returns this model's validation rules.
	 *
	 * @return array
	 */
	public function rules()
	{
		$rules = parent::rules();

		if ($this->urlFormatIsRequired)
		{
			$rules[] = array('urlFormat', 'required');
		}

		if ($this->nestedUrlFormatIsRequired)
		{
			$rules[] = array('nestedUrlFormat', 'required');
		}

		return $rules;
	}
}
