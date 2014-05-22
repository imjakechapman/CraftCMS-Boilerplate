<?php
namespace Craft;

class SproutActiveClassTwigExtension extends \Twig_Extension
{
  public function getName()
  {
    return 'Active Class';
  }

  public function getFunctions()
  {
    return array(
      'active' => new \Twig_Function_Method($this, 'getActive'),
      'activeClass' => new \Twig_Function_Method($this, 'getActiveClass', array('is_safe' => array('html'))),
      'segment' => new \Twig_Function_Method($this, 'getSegment'),
    );
  }

  public function getActive($match, $segment = 1, $className = 'active')
  {
    $segment = $this->_processSegment($segment);

    return ($segment == $match) ? $className : null;
  }

  public function getActiveClass($match, $segment = 1, $className = 'active')
  { 
    $segment = $this->_processSegment($segment);
    $activeClassString = 'class="' . $className . '"';

    return ($segment == $match) ? $activeClassString : null;
  }

  public function getSegment($segment = null)
  {
    return craft()->request->getSegment($segment);
  }

  private function _processSegment($segment)
  { 
    switch ($segment) {
      case 'url':
        return CRAFT_SITE_URL . craft()->request->url;
        break;

      case 'path':
        return craft()->request->path;
        break;
      
      default:
        return craft()->request->getSegment($segment);
        break;
    }
  }
}
