<?php

namespace Craft;

require_once(CRAFT_PLUGINS_PATH . 'typogrify/lib/smartypants.php');
require_once(CRAFT_PLUGINS_PATH . 'typogrify/lib/php-typogrify.php');

class TypogrifyTwigExtension extends \Twig_Extension
{

    public function getName()
    {
        return Craft::t('Typogrify');
    }

    public function getFilters()
    {
        return array(
            'widont' => new \Twig_Filter_Method($this, 'widontFilter'),
            'amp' => new \Twig_Filter_Method($this, 'ampFilter'),
            'smartypants' => new \Twig_Filter_Method($this, 'smartypantsFilter'),
            'caps' => new \Twig_Filter_Method($this, 'capsFilter'),
            'initial_quotes' => new \Twig_Filter_Method($this, 'initialQuotesFilter'),
            'dash' => new \Twig_Filter_Method($this, 'dashFilter'),
            'typogrify' => new \Twig_Filter_Method($this, 'typogrifyFilter')
        );
    }

    public function widontFilter($str)
    {
        $charset = craft()->templates->getTwig()->getCharset();

        $str = widont($str);

        return new \Twig_Markup($str, $charset);
    }

    public function ampFilter($str)
    {
        $charset = craft()->templates->getTwig()->getCharset();

        $str = amp($str);

        return new \Twig_Markup($str, $charset);
    }

    public function smartypantsFilter($str)
    {
        $charset = craft()->templates->getTwig()->getCharset();

        $str = Smartypants($str);

        return new \Twig_Markup($str, $charset);
    }

    public function capsFilter($str)
    {
        $charset = craft()->templates->getTwig()->getCharset();

        $str = caps($str);

        return new \Twig_Markup($str, $charset);
    }

    public function initialQuotesFilter($str)
    {
        $charset = craft()->templates->getTwig()->getCharset();

        $str = initial_quotes($str);

        return new \Twig_Markup($str, $charset);
    }

    public function dashFilter($str)
    {
        $charset = craft()->templates->getTwig()->getCharset();

        $str = dash($str);

        return new \Twig_Markup($str, $charset);
    }

    public function typogrifyFilter($str)
    {
        $charset = craft()->templates->getTwig()->getCharset();
        
        $str = typogrify($str);

        return new \Twig_Markup($str, $charset);
    }
}