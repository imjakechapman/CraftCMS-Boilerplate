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
class Redirect_Node extends \Twig_Node
{
	/**
	 * Compiles a Redirect_Node into PHP.
	 */
	public function compile(\Twig_Compiler $compiler)
	{
		$compiler
		    ->addDebugInfo($this)
		    ->write('\Craft\craft()->request->redirect(\Craft\UrlHelper::getUrl(')
		    ->subcompile($this->getNode('path'))
		    ->raw("));\n");
	}
}
