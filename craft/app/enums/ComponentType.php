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
abstract class ComponentType extends BaseEnum
{
	const AssetSource = 'assetSource';
	const Element     = 'element';
	const Field       = 'field';
	const Task        = 'task';
	const Tool        = 'tool';
	const Widget      = 'widget';
}
