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
 * Override the default CStatePersister so we can set a custom path at runtime for our state file.
 */
class StatePersister extends \CStatePersister
{
	/**
	 * Init
	 */
	public function init()
	{
		$this->stateFile = craft()->path->getStatePath().'state.bin';
		parent::init();
	}

	/**
	 * Saves application state in persistent storage.
	 *
	 * @param mixed $state state data (must be serializable).
	 */
	public function save($state)
	{
		IOHelper::writeToFile($this->stateFile, serialize($state));
	}
}
