<?php
namespace Craft;

// Define our script instead of rewriting them everywhere
define("FACEBOOK_SCRIPT", "<div id=\"fb-root\"></div><script>(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = \"//connect.facebook.net/en_US/all.js#xfbml=1&appId=543069402473732\"; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk'));</script>");
define("TWITTER_SCRIPT", "<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=\"https://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script>");
define("GOOGLE_SCRIPT", "<script type=\"text/javascript\">(function() {var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true; po.src = 'https://apis.google.com/js/platform.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s); })(); </script>");


class CraftySocialShareTwigExtension extends \Twig_Extension
{
  public function getName()
  {
    return 'CraftySocialShare';
  }

  public function getFunctions()
  {
    return array(
      'SocialShareScripts' => new \Twig_Function_Method($this, 'getSocialShareScripts'),
      'SocialBtn' => new \Twig_Function_Method($this, 'getSocialBtn'),
      'SocialBtns' => new \Twig_Function_Method($this, 'getSocialBtns')
    );
  }


  /**
   * Displays scripts markup
   *
   * @param string $scriptList    Pipe delimited list of scripts to show (facebook, twitter, google)
   * @return html                 Button scripts markup
   */
  public function getSocialShareScripts($scriptList = null)
  {

    $scripts = ''; // scripts to echo

    if ( $scriptList != null ) {
      $scriptList = explode('|', $scriptList); // pipe delimited list of scripts to include

      foreach ($scriptList as $script) {
        if ( $script == 'facebook' ) {
          $scripts .= FACEBOOK_SCRIPT;
        } elseif ( $script == 'twitter' ) {
          $scripts .= TWITTER_SCRIPT;
        } elseif ( $script == 'google' ) {
          $scripts .= GOOGLE_SCRIPT;
        }
      } // end foreach

    } else {
       $scripts .= FACEBOOK_SCRIPT;
       $scripts .= TWITTER_SCRIPT;
       $scripts .= GOOGLE_SCRIPT;
    } // end if

    echo $scripts;
  }


  /**
   * Displays social button of specified type
   *
   * @param string $type         Type of button to display (facebook, twitter, google)
   * @param array $options       User supplied options array
   * @return html                Button markup
   */
  public function getSocialBtn($type = null, $options = array()) {
    $button = '';

    switch ($type) {
      case 'facebook':

        $defaults = array(
          'url' => craft()->request->getHostInfo() . craft()->request->getUrl(),
          'width' => '150px',
          'layout' => 'button_count',
          'action' => 'like',
          'show-faces' => 'false',
          'share' => 'false'
        );
        $opts = $this->setOpts($defaults, $options);
        $button = "<div class=\"fb-like\" data-href=". $opts["url"] ." data-width=\"{$opts["width"]}\" data-layout=\"{$opts["layout"]}\" data-action=\"{$opts["action"]}\" data-show-faces=\"{$opts['show-faces']}\" data-share=\"{$opts['share']}\"></div>";

        break;

      case 'twitter':

        $defaults = array(
          'url' => craft()->request->getHostInfo() . craft()->request->getUrl(),
          'size' => '100px',
          'via' => '',
          'lang' => 'en',
          'text' => '',
          'related' => '',
          'count' => 'none',
          'counturl' => craft()->request->getHostInfo() . craft()->request->getUrl(),
          'hashtags' => '',
          'opt-out' => 'false'
        );
        $opts = $this->setOpts($defaults, $options);
        $button = "<a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-size=\"{$opts["size"]}\" data-via=\"{$opts["via"]}\" data-url=\"{$opts["url"]}\" data-lang=\"{$opts["lang"]}\" data-text=\"{$opts["text"]}\" data-related=\"{$opts["related"]}\" data-count=\"{$opts["count"]}\" data-counturl=\"{$opts["counturl"]}\" data-hashtags=\"{$opts["hashtags"]}\" data-dnt=\"{$opts["opt-out"]}\">Tweet</a>";

        break;

      case 'google':
        $defaults = array(
          'href' => craft()->request->getHostInfo() . craft()->request->getUrl(),
          'size' => 'standard',
          'annotation' => 'bubble',
          'width' => '120px',
          'align' => 'left',
          'expandTo' => '',
          'recommendations' => 'true',
          'count' => 'true'
        );
        $opts = $this->setOpts($defaults, $options);
        $button = "<div class=\"g-plusone\" data-href=\"{$opts["href"]}\" data-size=\"{$opts["size"]}\" data-annotation=\"{$opts["annotation"]}\" data-width=\"{$opts["width"]}\" data-align=\"{$opts["align"]}\" expandTo=\"{$opts["expandTo"]}\" data-recommendations=\"{$opts["recommendations"]}\" data-count=\"{$opts["count"]}\"></div>";
        break;

      default:
        $button = null;
        break;
    }

    echo $button;
  }


  /**
   * Displays html for user supplied list of buttons to show
   *
   * @param array $btnList      Pipe delimited list of buttons to display
   * @param string $width       Size to display buttons
   * @return mixed              Buttons to display html
   */
  public function getSocialBtns($btnList = null, $width = '120')
  {
    $buttons; // our return list of markup
    $btnList = explode('|', $btnList); // pipe delimited list of buttons to include
    $url = craft()->request->getHostInfo() . craft()->request->getUrl(); // Get Current URL

    if ( $btnList != null ) {
      foreach ($btnList as $btn) {

        if ( $btn == 'facebook' ) {

          $buttons .= "<div class=\"fb-like\" data-href=". $url ." data-width=". $width ." data-layout=\"button_count\" data-action=\"like\" data-show-faces=\"false\" data-share=\"false\"></div>";

        } elseif ( $btn == 'twitter' ) {

          $buttons .= "<a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-url=". $url ." data-lang=\"en\"></a>";

        } elseif ( $btn == 'google' ) {

          $buttons .= "<div class=\"g-plusone\" data-annotation=\"inline\" data-width=\"120\"></div>";

        } else {
          $buttons = "<div class=\"fb-like\" data-href=". $url ." data-width=". $width ." data-layout=\"button_count\" data-action=\"like\" data-show-faces=\"false\" data-share=\"false\"></div>";
          $buttons .= "\r";
          $buttons .= "<a href=\"https://twitter.com/share\" class=\"twitter-share-button\" data-url=". $url ." data-lang=\"en\"></a>";
          $buttons .= "\r";
          $buttons .= "<div class=\"g-plusone\" data-annotation=\"inline\" data-width=\"120\"></div>";
        }

      }
    }

    echo $buttons;
  }


  /**
   * Merges default options with user supplied options
   *
   * @param array $defaults      default options array set within switch case
   * @param array $opts          user supplied options array
   * @return array               newly merged array of button options
   */
  public function setOpts($defaults, $opts) {
    foreach( $opts as $key => $value ) {
      $defaults[$key] = $value;
    }
    return $defaults;
  }

}
