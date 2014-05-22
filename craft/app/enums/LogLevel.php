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
 * Just a duplicate of the consts in \CLogger for consistency!
 */
abstract class LogLevel extends BaseEnum
{
	const Trace   = 'trace';
	const Warning = 'warning';
	const Error   = 'error';
	const Info    = 'info';
	const Profile = 'profile';
}
