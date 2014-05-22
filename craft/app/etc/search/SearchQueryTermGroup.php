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
 * Search Query Term Group class
 *
 * Contains multiple SearchQueryTerm instances, each representing
 * a term in the search query that was combined by "OR".
 */
class SearchQueryTermGroup
{
	public $terms;

	/**
	 * Constructor
	 */
	function __construct($terms = array())
	{
		$this->terms = $terms;
	}
}
