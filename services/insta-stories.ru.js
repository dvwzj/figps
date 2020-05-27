const axios = require('axios')
const userAgents = require('user-agents')
const HttpsProxyAgent = require('https-proxy-agent')
const SocksProxyAgent = require('socks-proxy-agent')
const _ = require('lodash')

class Service {
  constructor () {
    this.name = 'insta-stories.ru'
    this.piority = 2
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
            `https://insta-stories.ru/${username}`,
            {
              headers: {
                'user-agent': userAgent
              }
            }
          )
          .then((res) => {
            const matches = res.data.match(/src="(main\.(.*?)\.js)"/)
            // console.log('res.data', res.data)
            if (matches) {
              this
                .axios
                .get(
                  `https://insta-stories.ru/${matches[1]}`,
                  {
                    headers: {
                      'user-agent': userAgent
                    }
                  }
                )
                .then((res2) => {
                  const matches2 = res2.data.match(/this\.xTrip="(.*?)"/)
                  if (matches2) {
                    this
                      .axios
                      .post(
                        `https://api.insta-stories.ru/posts`,
                        {
                          string: username,
                          'x-trip': matches2[1]
                        },
                        {
                          headers: {
                            'user-agent': userAgent
                          }
                        }
                      )
                      .then((res3) => {
                        // console.log('res3.data', res3.data)
                        const user = {
                          friendship_status: {
                            blocking: undefined,
                            followed_by: undefined,
                            following: undefined,
                            incoming_request: undefined,
                            is_bestie: undefined,
                            is_private: undefined,
                            is_restricted: undefined,
                            muting: undefined,
                            outgoing_request: undefined
                          },
                          full_name: undefined,
                          is_private: res3.data.user.private,
                          is_verified: undefined,
                          pk: res3.data.user.pk,
                          profile_pic_id: undefined,
                          profile_pic_url: res3.data.user.pictureHD || res3.data.user.picture,
                          username: res3.data.user.username
                        }
                        const items = _.orderBy(
                          _.map(res3.data.items, (item) => {
                            const carouselMedia = _.map(item.carousel, (media) => {
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
                                      url: media.img,
                                      width: undefined
                                    }
                                  ]
                                },
                                video_codec: undefined,
                                video_dash_manifest: undefined,
                                video_duration: undefined,
                                video_versions: media.video ? [
                                  {
                                    height: media.video.height,
                                    id: media.video.id,
                                    type: media.video.type,
                                    url: media.video.url,
                                    width: media.video.width
                                  }
                                ] : undefined,
                                view_count: undefined,
                                media_type: media.mediaType,
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
                                text: undefined,
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
                              carousel_media: item.carousel ? carouselMedia : undefined,
                              carousel_media_count: item.carousel ? _.size(carouselMedia) : undefined,
                              client_cache_key: undefined,
                              code: undefined,
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
                              id: undefined,
                              inline_composer_display_condition: undefined,
                              inline_composer_imp_trigger_time: undefined,
                              like_count: undefined,
                              max_num_visible_preview_comments: undefined,
                              media_type: item.carousel ? 8 : item.mediaType,
                              organic_tracking_token: undefined,
                              photo_of_you: undefined,
                              pk: undefined,
                              taken_at: item.takenAt,
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
                                    url: item.img,
                                    width: undefined
                                  }
                                ]
                              },
                              video_codec: undefined,
                              video_dash_manifest: undefined,
                              video_duration: undefined,
                              video_versions: item.video ? [
                                {
                                  height: item.video.height,
                                  id: item.video.id,
                                  type: item.video.type,
                                  url: item.video.url,
                                  width: item.video.width
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
                          next_max_id: res3.data.maxId,
                          num_results: _.size(items),
                          status: 'ok',
                          user,
                          items
                        })
                      })
                      .catch(reject)
                  } else {
                    reject(`Service ${this.name} not available (cannot get x-trip)`)
                  }
                })
                .catch(reject)
            } else {
              reject(`Service ${this.name} not available`)
            }
          })
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = Service
