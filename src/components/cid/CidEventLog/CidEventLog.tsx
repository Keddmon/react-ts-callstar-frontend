type EventItem = {
    type: string;
    payload?: any;
    timestamp: number;
};

type Props = {
    events: EventItem[];
    onClear: () => void;
};

const CidEventLog = ({
    events,
    onClear,
}: Props) => {

    /* ===== RENDER ===== */
    return (
        <div className="card">
            <div className="row" style={{ alignItems: 'center' }}>
                <h3 style={{ margin: 0, flex: 1 }}>이벤트 로그</h3>
                <button onClick={onClear}>지우기</button>
            </div>

            <div className="log">
                {events.length === 0 && <div className="muted">이벤트 없음</div>}
                {events.map((e, idx) => (
                    <div key={`${e.timestamp}-${idx}`} className="log-item">
                        <div className="log-meta">
                            <span>{new Date(e.timestamp).toLocaleTimeString()}</span>
                            <b style={{ marginLeft: 8 }}>{e.type}</b>
                        </div>
                        {e.payload != null && (
                            <pre className="log-pre">{JSON.stringify(e.payload, null, 2)}</pre>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CidEventLog;