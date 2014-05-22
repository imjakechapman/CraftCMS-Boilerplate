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
class Hook_TokenParser extends \Twig_TokenParser
{
	/**
	 * Defines the tag name.
	 *
	 * @return string
	 */
	public function getTag()
	{
		return 'hook';
	}

	/**
	 * Parses {% hook %} tags.
	 *
	 * @param \Twig_Token $token
	 * @return Hook_Node
	 */
	public function parse(\Twig_Token $token)
	{
		$lineno = $token->getLine();
		$hook = $this->parser->getExpressionParser()->parseExpression();
		$this->parser->getStream()->expect(\Twig_Token::BLOCK_END_TYPE);

		return new Hook_Node(array('hook' => $hook), array(), $lineno, $this->getTag());
	}
}
