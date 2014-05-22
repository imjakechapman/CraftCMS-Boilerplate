<?php

namespace OAuth\OAuth1;

use \Exception;

class Consumer
{
    /**
     * @var  string  consumer key
     */
    protected $key;

    /**
     * @var  string  consumer secret
     */
    protected $secret;

    /**
     * @var  string  callback URL for OAuth authorization completion
     */
    protected $callback;

    /**
     * @var  string  scope for OAuth authorization completion
     */
    protected $scope;

    /**
     * @var  string  scope separator, most use "," but some like Google are spaces
     */
    public $scope_seperator = ',';

    /**
     * Sets the consumer key and secret.
     *
     * @param   array  consumer options, key and secret are required
     * @return void
     */
    public function __construct(array $options = null)
    {
        if (empty($options['id'])) {
            throw new Exception('Required option not provided: id');
        }

        if (empty($options['redirect_url'])) {
            throw new Exception('Required option not provided: redirect_url');
        }

        $this->client_id = $options['id'];

        isset($options['redirect_url']) and $this->redirect_url = $options['redirect_url'];
        isset($options['secret']) and $this->secret = $options['secret'];
        isset($options['scope']) and $this->scope = $options['scope'];
    }

    /**
     * Return the value of any protected class variable.
     *
     *     // Get the consumer key
     *     $key = $consumer->key;
     *
     * @param   string  variable name
     * @return mixed
     */
    public function __get($key)
    {
        return $this->$key;
    }

    /**
     * Change the consumer callback.
     *
     * @param   string  new consumer callback
     * @return  $this
     */
    public function callback($callback)
    {
        $this->callback = $callback;

        return $this;
    }

    public function scope($scope)
    {
        $this->scope = is_array($scope) ? implode($this->scope_seperator, $scope) : $this->scope;

        return $this;
    }

} // End Consumer
