import json,sys
d='youtube/panjang/kelas-02/'
tl=json.load(open(d+'work/timeline.json')); ep=json.load(open(d+'episode.json'))
rows={r['n']:r for r in tl['adegan']}; out=[]
for a in ep['adegan']:
    r=rows[a['n']]; sh=a.get('shots',[]); st=[]
    for s in sh:
        if 'cue' in s:
            txt=r['text'].lower(); i=txt.find(s['cue'].lower()); w=[x for x in r['words'] if x['i']<=i][-1]
            t=r['start']+r['voOff']+w['t']+s.get('d',0)
        else: t=r['start']+s.get('at',0)
        st.append(t)
    for k,s in enumerate(sh):
        e=st[k+1] if k+1<len(st) else r['end']; fx=(s.get('fx') or [{}])[0].get('type','?'); out.append((a['n'],k,fx,st[k],e))
if __name__=='__main__':
    ts=[]
    for n,k,fx,s,e in out:
        print(n,k,fx,round(s,1),round(e-s,1)); 
        for f in (.35,.8): ts.append(round(s+(e-s)*f,2))
    json.dump(out,open(d+'work/shots.json','w'))
    print(','.join(map(str,ts)))
