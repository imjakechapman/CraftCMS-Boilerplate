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
abstract class PeriodType extends BaseEnum
{
	const Seconds = 'seconds';
	const Minutes = 'minutes';
	const Hours   = 'hours';
	const Days    = 'days';
	const Weeks   = 'weeks';
	const Months  = 'months';
	const Years   = 'years';
}
