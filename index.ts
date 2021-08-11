import { initializeApp, getApp } from 'firebase/app'
import { DatabaseReference, getDatabase, ref, get, onValue, Unsubscribe, DataSnapshot } from 'firebase/database'

const firebaseConfig = {
    databaseURL: "https://hacker-news.firebaseio.com"
}

let app

try {
    app = initializeApp(firebaseConfig, "hacker-news-realtime-listener")
}
catch(e) {
    // Maybe we initialized Firebase twice, let's try to get the app
    app = getApp("hacker-news-realtime-listener")
    if(!app) {
        throw e
    }
}

const db = getDatabase(app)

export class RealtimeListener {
    _maxItemRef: DatabaseReference
    _unsubscribeFunc?: Unsubscribe
    callback: Function

    constructor(callback: Function) {
        if(!callback) {
            throw new Error("Callback missing")
        }
        this._maxItemRef = ref(db, "/v0/maxitem")
        this._unsubscribeFunc = undefined
        this.callback = callback
    }

    async _maxItemUpdateHandler(snap: DataSnapshot): Promise<void> {
        const id = snap.val()
        const itemRef = ref(db, `/v0/item/${id}`)
        const itemSnap = await get(itemRef)
        if(itemSnap.val() == null) {
            // Retry as Hacker News articles can take time to propagate
            this._maxItemUpdateHandler(snap)
            return
        }
        this.callback(itemSnap.val())
    }

    start(): RealtimeListener {
        if(this._unsubscribeFunc) {
            throw new Error("Listener has already started")
        }
        this._unsubscribeFunc = onValue(this._maxItemRef, this._maxItemUpdateHandler.bind(this))
        return this
    }

    stop() {
        if(!this._unsubscribeFunc) {
            throw new Error("RealtimeListener is not listening")
        }

        this._unsubscribeFunc()
        this._unsubscribeFunc = undefined
    }
}

export default function listen(callback: (item: Object) => any) {
    return new RealtimeListener(callback).start()
}

if(typeof window != "undefined") {
    // @ts-ignore
    window.listen = listen
    // @ts-ignore
    window.RealtimeListener = RealtimeListener
}