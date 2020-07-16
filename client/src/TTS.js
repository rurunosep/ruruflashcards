import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import { google } from '@google-cloud/text-to-speech/build/protos/protos'
import { JWT } from 'google-auth-library'

class TTS {
  static client = undefined
  static voices = []
  static languageCodes = []

  static async initialize() {
    /* ~~~~~
      ♡ Pretty please, no stealerino ♡
    ~~~~~ */
    const authJSON = {
      type: 'service_account',
      project_id: 'ruruflashcards',
      private_key_id: 'acceae75f2711f9eeb724520248a9cf779f8d8cc',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDR/q75TPMsWUen\nBZg+FJQRCjSvPM1cpKl954Svp1hOIw2xjIHqXw1d/f1obXmgjgU4iYW8x/IJCfsK\nGUGWUF418ad1X113rGoaHQQpakjOubbeg9j4GAKjAeVz8XDK34oFYFJ997Bsl3rg\nm6np6eQ1+q2zKq2JH82aRMDD5YeBFUlTKPqfkRw4BPPdYHtYQhlh/vu+QbRww2tW\n0hsc4EY+GeC0AwUXRcjzY+UAreWRgM9uAJI+Lqv47iI//NmvEYKWdecIbYcruxKp\n4D8qTCdMrYPLF9kDK1jYUsklsqe51G4FZFwEXbOTV1GQBn133JVEzsLl1dHr2zCJ\nz7BXr1qvAgMBAAECggEARnjTbIuD4gK2Npl8jXzncc58fsCHZItH7B5Jm48r5dEC\ns+5k3Ov4Nu5ZX/W5RwXSP7Z7IK7zDVCBpFJ0fcbLzwuheJS/77z3QHszXdiyxVly\nwrr5kcyw+dZVk/LXOOYK0iIQnQCF/vNZA86Jl5vr/6d4KnPsl+OJ4rcm/7bkIg+Q\nexuGpLaONQiF2NIvQq/pi5HdZHq+iTF80tn7UfnuAm+J4jY6/npVRYXJXbunonzG\npPewvrGNGjCCjvGf0yPXKiOwKSkjuCTN4TH+VJZZSGV/rhmoYTkf7hZXDHihfEix\nQQ/UdomJTMljPPkpHsg/U/fRsIB2qpsSR0jtxSx5xQKBgQDwRS3M1VkdBzdxaSKN\nfLq09kAZc70j1h2ctrJPHa2YCFHJjOEmhEaN/twyHlXcVb1dMVnfwUwxeO5UZhwS\n3CI3VI18u3vMr0KVHCgtCIeWVeNnlaJ8yw8V2vqkfuTjgGYWpCY2Qo411SOam3Vl\nzJoDFKx7+zgi/XxXjK0mxEWQnQKBgQDfvhpaaIeFWZd/GQmxzy1SHhSBvCNfUOpC\nt4i7xvyIRY8NO5r6q5aM9xEenDyzl4nc01kIswqOhgKH34VuICa5mOHXUJz1CXUe\n1a7/TzUhZ8GeOWl7Z1JGPw29bpfUAkeRlmmTRwunRSDgF46kJQUNrBQgg1WOKg5/\n2NhtF5AYuwKBgQCpeuK3nbZiN3jwUozA6L56b0j/qxg7cwkoRea4z+JnX1bxqKIY\nnS13c9K2t5cw+Hm+htUydBLewsK6XdxnoUexZ771wPmug+GfdGESgvXBIYxqwK4B\nAOr/K5uo9KlXoHZieh9KHuBZMKMQp5/D0vLAQZD5U1dhtxRCXUS2F7RKMQKBgQCf\nOLusRuLaRM2IxxqdDKBl5b4WLPrHI9/xpoaJiqu/ljCc7CP36w/yNQhbzjdsXpTf\nLxAXHsKOdlNquehMXFjyjxd4kIeB4T8VuF8WlRlsMlgY7yZfiUGFd+2hNwiY+R5R\nPsbW5iIm4QzqLBl4OlgESMbx9ER4LPmwhXJPAAutbQKBgQDPJLj6dIVLoimBydpv\nlv8V94Hfh3oLSoaMIu5ONOUjbYReE5/gZfsJ9wv2BKEmdhxTcDyEEo4Vjx1MK0zD\nk2uWGNebIkjHY+um/rRVzc/TRAUR4GSwWjzX3NNzVTxkhMj11zxpyruNU3Vo+UwU\ns7LkwlgtHEbLEa59eP+tojg8OA==\n-----END PRIVATE KEY-----\n',
      client_email: 'ruruflashcards-user@ruruflashcards.iam.gserviceaccount.com',
      client_id: '108355697865110828466',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/ruruflashcards-user%40ruruflashcards.iam.gserviceaccount.com'
    }

    try {
      const authClient = new JWT({
        email: authJSON.client_email,
        key: authJSON.private_key,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      })

      this.client = new TextToSpeechClient({ auth: authClient })

      const [response] = await this.client.listVoices()
      this.voices = response.voices
      this.languageCodes = [
        ...new Set(this.voices.map((v) => v.languageCodes).reduce((flat, x) => [...flat, ...x]))
      ].sort()
    } catch (err) {
      console.error(err)
      // If anything went wrong, set client to undefined to disable all TTS features
      this.client = undefined
    }
  }

  static async play(text, language, voice) {
    if (!this.client) return

    const request = {
      input: { text: text },
      voice: { languageCode: language, name: voice },
      audioConfig: {
        audioEncoding: google.cloud.texttospeech.v1.AudioEncoding.MP3
      }
    }

    const [response] = await this.client.synthesizeSpeech(request)
    const blob = new Blob([response.audioContent], { type: 'audio/mp3' })
    const url = window.URL.createObjectURL(blob)
    const audio = new Audio(url)
    audio.play()
  }
}

export default TTS
