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
class RequireEdition_Node extends \Twig_Node
{
	/**
	 * Compiles a RequireEdition_Node into PHP.
	 */
	public function compile(\Twig_Compiler $compiler)
	{
		$compiler
			->addDebugInfo($this)
			->write('if (\Craft\craft()->getEdition() < ')
			->subcompile($this->getNode('editionName'))
			->raw(")\n")
			->write("{\n")
			->indent()
			->write("throw new \Craft\HttpException(404);\n")
			->outdent()
			->write("}\n");
	}
}
