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
abstract class UserStatus extends BaseEnum
{
	const Active                = 'active';
	const Locked                = 'locked';
	const Suspended             = 'suspended';
	const Pending               = 'pending';
	const Archived              = 'archived';
}
