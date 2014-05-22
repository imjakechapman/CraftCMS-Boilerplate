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
 * Search Query Term class
 *
 * Represents a term in the search query.
 */
class SearchQueryTerm
{
	public $exclude   = false;
	public $exact     = false;
	public $subLeft   = false;
	public $subRight  = false;
	public $attribute = null;
	public $term      = null;
}
