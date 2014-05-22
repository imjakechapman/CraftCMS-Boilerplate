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
 * Component type interface
 */
interface IComponentType
{
	/**
	 * @return string
	 */
	public function getName();

	/**
	 * @return string
	 */
	public function getClassHandle();

	/**
	 * @return bool
	 */
	public function isSelectable();
}
