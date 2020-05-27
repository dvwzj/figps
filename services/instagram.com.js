const userAgents = require('user-agents')
const HttpsProxyAgent = require('https-proxy-agent')
const SocksProxyAgent = require('socks-proxy-agent')
const _ = require('lodash')
const Instagram = require('instagram-web-api')

class Service {
  constructor () {
    this.name = 'instagram.com'
    this.piority = 9999
    this.api = new Instagram({})
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
    this.api = new Instagram({}, { proxy: httpAgent.proxy.href })
    return this
  }

  get (username) {
    return new Promise((resolve, reject) => {
      try {
        const userAgent = (new userAgents()).toString()
        this
          .api
          .request
          .defaults({
            headers: {
              'user-agent': userAgent
            }
          })
        this
          .api
          .getUserByUsername({ username })
          .then((data) => {
            if (data) {
              const user = _.merge(
                _.pick(
                  data,
                  [
                    'full_name',
                    'is_private',
                    'is_verified',
                    'profile_pic_id',
                    'profile_pic_url',
                    'profile_pic_url_hd',
                    'username'
                  ]
                ),
                {
                  pk: data.id
                }
              )
              this
                .api
                .getPhotosByUsername({ username })
                .then((data) => {
                  if (data) {
                    const items = _.orderBy(
                      _.map(_.map(data.user.edge_owner_to_timeline_media.edges, 'node'), (item) => {
                        const carouselMedia = _.map(item.edge_sidecar_to_children ? _.map(item.edge_sidecar_to_children.edges, 'node') : [], (media) => {
                          return {
                            can_see_insights_as_brand: undefined,
                            carousel_parent_id: item.id,
                            id: media.id,
                            image_versions2: {
                              candidates: [
                                {
                                  estimated_scans_sizes: [
                                    //
                                  ],
                                  height: media.dimensions.height,
                                  scans_profile: undefined,
                                  url: media.display_url,
                                  width: media.dimensions.width
                                }
                              ]
                            },
                            video_codec: undefined,
                            video_dash_manifest: undefined,
                            video_duration: undefined,
                            video_versions: media.is_video ? [
                              {
                                height: media.dimensions.height,
                                id: undefined,
                                type: undefined,
                                url: media.video_url,
                                width: media.dimensions.width
                              }
                            ] : undefined,
                            view_count: undefined,
                            media_type: media.is_video ? 2 : 1,
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
                            text: item.edge_media_to_caption ? edge_media_to_caption.edges[0].node.text : undefined,
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
                                'profile_pic_url_hd',
                                'username'
                              ]
                            ),
                            user_id: undefined
                          },
                          caption_is_edited: undefined,
                          carousel_media: _.size(carouselMedia) > 1 ? carouselMedia : undefined,
                          carousel_media_count: _.size(carouselMedia) > 1 ? _.size(carouselMedia) : undefined,
                          client_cache_key: undefined,
                          code: item.shortcode,
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
                          media_type: item.is_video ? 2 : (_.size(carouselMedia) > 1 ? 8 : 1),
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
                              'profile_pic_url_hd',
                              'username'
                            ]
                          ),
                          image_versions2: {
                            candidates: [
                              {
                                estimated_scans_sizes: [
                                  //
                                ],
                                height: item.dimensions.height,
                                scans_profile: undefined,
                                url: item.display_url,
                                width: item.dimensions.width
                              }
                            ]
                          },
                          video_codec: undefined,
                          video_dash_manifest: undefined,
                          video_duration: undefined,
                          video_versions: item.is_video ? [
                            {
                              height: item.dimensions.height,
                              id: undefined,
                              type: undefined,
                              url: item.video_url,
                              width: item.dimensions.width
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
                  } else {
                    reject('return undefined!')
                  }
                })
                .catch(reject)
            } else {
              reject('return undefined!')
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
