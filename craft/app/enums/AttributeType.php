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
abstract class AttributeType extends BaseEnum
{
	const Mixed      = 'mixed';
	const Bool       = 'bool';
	const ClassName  = 'classname';
	const DateTime   = 'datetime';
	const Email      = 'email';
	const Enum       = 'enum';
	const Handle     = 'handle';
	const Locale     = 'locale';
	const Name       = 'name';
	const Number     = 'number';
	const Slug       = 'slug';
	const SortOrder  = 'sortorder';
	const String     = 'string';
	const Template   = 'template';
	const Url        = 'url';
	const UrlFormat  = 'urlformat';
	const Uri        = 'uri';
}
