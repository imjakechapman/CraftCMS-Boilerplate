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
abstract class ElementType extends BaseEnum
{
	const Asset       = 'Asset';
	const Category    = 'Category';
	const Entry       = 'Entry';
	const GlobalSet   = 'GlobalSet';
	const MatrixBlock = 'MatrixBlock';
	const Tag         = 'Tag';
	const User        = 'User';
}
