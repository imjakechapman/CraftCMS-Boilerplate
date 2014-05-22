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
 * Tool interface
 */
interface ITask extends ISavableComponentType
{
	/**
	 * @return string
	 */
	public function getDescription();

	/**
	 * @return int
	 */
	public function getTotalSteps();

	/**
	 * @param int $step
	 * @return bool
	 */
	public function runStep($step);
}
