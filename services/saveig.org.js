const axios = require('axios')
const userAgents = require('user-agents')
const HttpsProxyAgent = require('https-proxy-agent')
const SocksProxyAgent = require('socks-proxy-agent')
const _ = require('lodash')
const { JSDOM } = require('jsdom')
const jsdom = new JSDOM
const $ = require('jquery')(jsdom.window)

class Service {
  constructor () {
    this.name = 'saveig.org'
    this.piority = 1
    this.axios = axios.create()
  }

  setProxy (proxy) {
    let httpAgent
    if (proxy && proxy.host && proxy.port) {
      let { protocol } = proxy
      if (protocol === undefined) {
        protocol = 'http'
      }
      if (proxy.auth && proxy.auth.user && proxy.auth.pass) {
        if (protocol.startsWith('http')) {
          httpAgent = new HttpsProxyAgent(`${protocol}://${proxy.auth.user}:${proxy.auth.pass}@${proxy.host}:${proxy.port}`)
        } else if (protocol.startsWith('socks')) {
          httpAgent = new SocksProxyAgent(`${protocol}://${proxy.auth.user}:${proxy.auth.pass}@${proxy.host}:${proxy.port}`)
        }
      } else {
        if (protocol.startsWith('http')) {
          httpAgent = new HttpsProxyAgent(`${protocol}://${proxy.host}:${proxy.port}`)
        } else if (protocol.startsWith('socks')) {
          httpAgent = new SocksProxyAgent(`${protocol}://${proxy.host}:${proxy.port}`)
        }
      }
    } else if (proxy && proxy.match(/:\/\//)) {
      if (proxy.startsWith('http')) {
        httpAgent = new HttpsProxyAgent(proxy)
      } else if (proxy.startsWith('socks')) {
        httpAgent = new SocksProxyAgent(proxy)
      }
    }
    this.axios.defaults.httpAgent = this.axios.defaults.httpsAgent = httpAgent
    return this
  }

  get (username) {
    return new Promise((resolve, reject) => {
      try {
        const userAgent = (new userAgents()).toString()
        this
          .axios
          .get(
            `https://saveig.org/${username}`,
            {
              headers: {
                'user-agent': userAgent
              }
            }
          )
          .then((res) => {
            const userinfo = $(res.data).find('.userinfo')
            const user = {
              full_name: _.trim(userinfo.find('.name').text()),
              is_private: undefined,
              is_verified: undefined,
              pk: userinfo.data('id'),
              profile_pic_id: undefined,
              profile_pic_url: userinfo.find('img').attr('src'),
              username: userinfo.data('name')
            }
            this
              .axios
              .get(
                `https://api.saveig.org/api/posts/?id=${user.pk}&lang=en&username=${user.username}`,
                {
                  headers: {
                    'user-agent': userAgent
                  }
                }
              )
              .then((res2) => {
                // console.log('res2.data', res2.data)
                const items = _.orderBy(
                  _.map(_.groupBy(res2.data.items, 'id'), (postItems) => {
                    const item = _.first(postItems)
                    const carouselMedia = _.map(postItems, (media) => {
                      return {
                        can_see_insights_as_brand: undefined,
                        carousel_parent_id: undefined,
                        id: undefined,
                        image_versions2: {
                          candidates: [
                            {
                              estimated_scans_sizes: [
                                //
                              ],
                              height: undefined,
                              scans_profile: undefined,
                              url: media.thumb,
                              width: undefined
                            }
                          ]
                        },
                        video_codec: undefined,
                        video_dash_manifest: undefined,
                        video_duration: undefined,
                        video_versions: media.isVideo ? [
                          {
                            height: undefined,
                            id: undefined,
                            type: undefined,
                            url: media.src,
                            width: undefined
                          }
                        ] : undefined,
                        view_count: undefined,
                        media_type: media.isVideo ? 2 : 1,
                        original_height: undefined,
                        original_width: undefined,
                        pk: undefined
                      }
                    })
                    return {
                      can_see_insights_as_brand: undefined,
                      can_view_more_preview_comments: undefined,
                      can_viewer_reshare: undefined,
                      can_viewer_save: undefined,
                      caption: {
                        bit_flags: undefined,
                        content_type: undefined,
                        created_at: undefined,
                        created_at_utc: undefined,
                        did_report_as_spam: undefined,
                        has_translation: undefined,
                        media_id: undefined,
                        pk: undefined,
                        share_enabled: undefined,
                        status: undefined,
                        text: item.alt,
                        type: undefined,
                        user: _.pick(
                          user,
                          [
                            'full_name',
                            'has_anonymous_profile_picture',
                            'is_favorite',
                            'is_private',
                            'is_unpublished',
                            'is_verified',
                            'latest_reel_media',
                            'pk',
                            'profile_pic_id',
                            'profile_pic_url',
                            'username'
                          ]
                        ),
                        user_id: undefined
                      },
                      caption_is_edited: undefined,
                      carousel_media: _.size(postItems) > 1 ? carouselMedia : undefined,
                      carousel_media_count: _.size(postItems) > 1 ? _.size(carouselMedia) : undefined,
                      client_cache_key: undefined,
                      code: item.code,
                      comment_count: undefined,
                      comment_likes_enabled: undefined,
                      comment_threading_enabled: undefined,
                      device_timestamp: undefined,
                      facepile_top_likers: [
                        {
                          full_name: undefined,
                          is_private: undefined,
                          is_verified: undefined,
                          pk: undefined,
                          profile_pic_id: undefined,
                          profile_pic_url: undefined,
                          username: undefined
                        }
                      ],
                      filter_type: undefined,
                      has_liked: undefined,
                      has_more_comments: undefined,
                      id: item.id,
                      inline_composer_display_condition: undefined,
                      inline_composer_imp_trigger_time: undefined,
                      like_count: undefined,
                      max_num_visible_preview_comments: undefined,
                      media_type: item.isVideo ? 2 : (_.size(postItems) > 1 ? 8 : 1),
                      organic_tracking_token: undefined,
                      photo_of_you: undefined,
                      pk: undefined,
                      taken_at: item.timestamp,
                      top_likers: [
                        //
                      ],
                      user: _.pick(
                        user,
                        [
                          'full_name',
                          'has_anonymous_profile_picture',
                          'is_favorite',
                          'is_private',
                          'is_unpublished',
                          'is_verified',
                          'latest_reel_media',
                          'pk',
                          'profile_pic_id',
                          'profile_pic_url',
                          'username'
                        ]
                      ),
                      image_versions2: {
                        candidates: [
                          {
                            estimated_scans_sizes: [
                              //
                            ],
                            height: undefined,
                            scans_profile: undefined,
                            url: item.thumb,
                            width: undefined
                          }
                        ]
                      },
                      video_codec: undefined,
                      video_dash_manifest: undefined,
                      video_duration: undefined,
                      video_versions: item.isVideo ? [
                        {
                          height: undefined,
                          id: undefined,
                          type: undefined,
                          url: item.src,
                          width: undefined
                        }
                      ] : undefined,
                      view_count: undefined
                    }
                  }),
                  ['taken_at'],
                  ['desc']
                )
                resolve({
                  auto_load_more_enabled: undefined,
                  more_available: undefined,
                  next_max_id: undefined,
                  num_results: _.size(items),
                  status: 'ok',
                  user,
                  items
                })
              })
              .catch(reject)
          })
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = Service
