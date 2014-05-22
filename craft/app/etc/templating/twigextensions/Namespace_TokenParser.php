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
class Namespace_TokenParser extends \Twig_TokenParser
{
	/**
	 * Defines the tag name.
	 *
	 * @return string
	 */
	public function getTag()
	{
		return 'namespace';
	}

	/**
	 * Parses {% namespace %}...{% endnamespace %} tags.
	 *
	 * @param \Twig_Token $token
	 * @return Namespace_Node
	 */
	public function parse(\Twig_Token $token)
	{
		$lineno = $token->getLine();
		$stream = $this->parser->getStream();
		$namespace = $this->parser->getExpressionParser()->parseExpression();
		$stream->expect(\Twig_Token::BLOCK_END_TYPE);
		$body = $this->parser->subparse(array($this, 'decideNamespaceEnd'), true);
		$stream->expect(\Twig_Token::BLOCK_END_TYPE);

		return new Namespace_Node(array('namespace' => $namespace, 'body' => $body), array(), $lineno, $this->getTag());
	}

	/**
	 * @param \Twig_Token $token
	 * @return bool
	 */
	public function decideNamespaceEnd(\Twig_Token $token)
	{
		return $token->test('endnamespace');
	}
}
