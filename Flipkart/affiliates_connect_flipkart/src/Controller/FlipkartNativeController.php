<?php

namespace Drupal\affiliates_connect_flipkart\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

/**
 * Use Native API of Flipkart to collect data.
 */
class FlipkartNativeController extends ControllerBase {

  /**
   * The Guzzle client.
   *
   * @var \GuzzleHttp\Client
   */
  protected $client;


  /**
   * Render the list of plugins for a affiliates network.
   *
   * @return array
   *   Render array listing the integrations.
   */
  public function get() {

    $client = new Client();

    $fk_affiliate_id = $this->config('affiliates_connect_flipkart.settings')->get('flipkart_tracking_id');
    $token = $this->config('affiliates_connect_flipkart.settings')->get('flipkart_token');

    $header = [
        'Fk-Affiliate-Id' => $fk_affiliate_id,
        'Fk-Affiliate-Token' => $token,
        'Accept' => 'application/json',
    ];

    $url = 'https://affiliate-api.flipkart.net/affiliate/api/' . $fk_affiliate_id . '.json';

    try {
      $response = $client->get($url, [
        'headers' => $header,
      ]);
    }
    catch (RequestException $e) {
      $args = ['%site' => $url, '%error' => $e->getMessage()];
      throw new \RuntimeException($this->t('This %site seems to be broken because of error "%error".', $args));
    }
    $body = $response->getBody();
    $body = json_decode($body, true);
    $categories = [];
    foreach ($body['apiGroups']['affiliate']['apiListings'] as $key => $value) {
      $categories[$key] = $value['availableVariants']['v1.1.0']['get'];
    }
    print_r($categories);
  }

}
