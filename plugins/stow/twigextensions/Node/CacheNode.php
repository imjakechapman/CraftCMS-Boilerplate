<?php

/*
 * This file is part of twig-cache-extension.
 *
 * (c) Alexander <iam.asm89@gmail.com>
 * Edits made by Connor Smith
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Craft;

/**
 * Cache twig node.
 *
 * @author Alexander <iam.asm89@gmail.com>
 * Edits made by Connor Smith <connor@sphinx.io>
 */
class CacheNode extends \Twig_Node
{
    private static $cacheCount = 1;

    /**
     * @param string                $annotation
     * @param \Twig_Node_Expression $keyInfo
     * @param \Twig_NodeInterface   $body
     * @param integer               $lineno
     * @param string                $tag
     */
    public function __construct($annotation, \Twig_Node_Expression $keyInfo, \Twig_NodeInterface $body, $lineno, $tag = null)
    {
        parent::__construct(array('key_info' => $keyInfo, 'body' => $body), array('annotation' => $annotation), $lineno, $tag);
    }

    /**
     * {@inheritDoc}
     */
    public function compile(\Twig_Compiler $compiler)
    {
        $i = self::$cacheCount++;

        $compiler
            ->addDebugInfo($this)
            ->write("\$stow00CacheStrategy".$i." = \$this->getEnvironment()->getExtension('stow')->getCacheStrategy();\n")
            ->write("\$stow00Key".$i." = \$stow00CacheStrategy".$i."->generateKey(")
                ->subcompile($this->getNode('key_info'))
            ->write(");\n")
            ->write("\$stow00CacheBody".$i." = \$stow00CacheStrategy".$i."->fetchBlock(\$stow00Key".$i.");\n")
            ->write("if (\$stow00CacheBody".$i." === false) {\n")
            ->indent()
                ->write("ob_start();\n")
                    ->indent()
                        ->subcompile($this->getNode('body'))
                    ->outdent()
                ->write("\n")
                ->write("\$stow00CacheBody".$i." = ob_get_clean();\n")
                ->write("\$stow00CacheStrategy".$i."->saveBlock(\$stow00Key".$i.", \$stow00CacheBody".$i.");\n")
            ->outdent()
            ->write("}\n")
            ->write("echo \$stow00CacheBody".$i.";\n")
        ;
    }
}