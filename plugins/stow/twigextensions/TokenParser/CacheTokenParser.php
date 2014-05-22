<?php

/*
 * This file is part of twig-cache-extension.
 *
 * (c) Alexander <iam.asm89@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Edits made by Connor Smith <connor@sphinx.io>
 */

namespace Craft;

/**
 * Parser for cache/endcache blocks.
 *
 * @author Alexander <iam.asm89@gmail.com>
 * Edits made by Connor Smith <connor@sphinx.io>
 */
class CacheTokenParser extends \Twig_TokenParser
{
    /**
     * @return boolean
     */
    public function decideCacheEnd(\Twig_Token $token)
    {
        return $token->test('endcache');
    }

    /**
     * {@inheritDoc}
     */
    public function getTag()
    {
        return 'cache';
    }

    /**
     * {@inheritDoc}
     */
    public function parse(\Twig_Token $token)
    {
        Craft::import('plugins.stow.twigextensions.Node.CacheNode');

        $lineno = $token->getLine();
        $stream = $this->parser->getStream();

        $key = $this->parser->getExpressionParser()->parseExpression();

        $stream->expect(\Twig_Token::BLOCK_END_TYPE);
        $body = $this->parser->subparse(array($this, 'decideCacheEnd'), true);
        $stream->expect(\Twig_Token::BLOCK_END_TYPE);

        return new CacheNode('', $key, $body, $lineno, $this->getTag());
    }
}