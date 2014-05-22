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
 * Option data class
 */
class OptionData
{
	public $label;
	public $value;
	public $selected;

	/**
	 * Constructor
	 *
	 * @param string $label
	 * @param string $value
	 */
	function __construct($label, $value, $selected)
	{
		$this->label = $label;
		$this->value = $value;
		$this->selected = $selected;
	}

	/**
	 * @return string
	 */
	public function __toString()
	{
		return (string) $this->value;
	}
}
