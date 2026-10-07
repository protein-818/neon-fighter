#!/usr/bin/env python3
"""公開前の確認。公開物（index.html と外付け部品）をヘッドレスブラウザで通す。

使い方: python3 tools/check_site.py [画面の保存先=shots]
要るもの: Python の playwright と Chromium（pip install playwright ののち playwright install chromium）

見るもの: キーボードのみ／コントローラー1台（溜めを含む）／コントローラー2台の2人対戦／
英語表示／せまい窓とスマホ横持ち。計測が1回ずつ出ること、エラーが出ないこと。
すべて PASS なら終了コード 0。1つでも FAIL なら 1。
先に python3 tools/build.py で index.html を作っておく。
"""
import asyncio,http.server,threading,functools,sys,json,os,urllib.parse
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8772),functools.partial(H,directory=ROOT));threading.Thread(target=srv.serve_forever,daemon=True).start()
INIT="""const mk=()=>({connected:true,buttons:Array.from({length:17},()=>({pressed:false,value:0})),axes:[0,0,0,0]});
window.__pads=[mk(),mk()];window.__n=0;navigator.getGamepads=()=>window.__pads.slice(0,window.__n);"""
OUT=sys.argv[1] if len(sys.argv)>1 else os.path.join(ROOT,'shots');os.makedirs(OUT,exist_ok=True);fails=[]
def ok(name,c):
    print(('PASS ' if c else 'FAIL ')+name)
    if not c:fails.append(name)
async def page(b,w=1000,h=720,lang='ja-JP',touch=False):
    ctx=await b.new_context(viewport={'width':w,'height':h},locale=lang,has_touch=touch,is_mobile=touch)
    pg=await ctx.new_page();pg.errs=[];pg.logs=[]
    pg.on('pageerror',lambda e:pg.errs.append(str(e)));pg.on('console',lambda m:pg.logs.append(m.text))
    await pg.route('**/googletagmanager.com/**',lambda r:r.abort())
    await pg.add_init_script(INIT)
    await pg.goto('http://127.0.0.1:8772/index.html?nfa_debug=1');await pg.wait_for_timeout(1300)
    return pg
def nfa(pg):return [json.loads(l.split(' ',2)[2])|{'_':l.split(' ')[1]} for l in pg.logs if l.startswith('[NFA]')]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        # 1. keyboard only, VS CPU
        pg=await page(b);ev=pg.evaluate;kb=pg.keyboard
        await pg.screenshot(path=OUT+'/title_ja.png')
        await kb.press('1');await kb.press('Enter');await kb.press('Enter')
        await pg.wait_for_function('mode=="play"',timeout=90000)
        await kb.down('ArrowRight');await pg.wait_for_timeout(150);ok('kb cpu: hold right',await ev('A.in.r')==1);await kb.up('ArrowRight')
        await ev("B.x=620;A.x=200;A.st='i'");await kb.press('z');await pg.wait_for_timeout(50);ok('kb cpu: z attacks',(await ev('A.st'))=='atk')
        await ev('A.rw=1;B.hp=0;ko(B)');await pg.wait_for_function('mode=="end"',timeout=90000);await pg.wait_for_timeout(600)
        ok('share ja cpu',await ev("[...document.querySelectorAll('a')].find(a=>a.textContent.includes('シェア'))?.style.display")=='block')
        e=nfa(pg);ok('events once each: '+str([x['_'] for x in e]),[x['_'] for x in e]==['match_start','match_end'])
        ok('match_start has mode=cpu lang=ja',e[0].get('mode')=='cpu' and e[0].get('lang')=='ja');ok('no errors (kb)',pg.errs==[])
        await pg.context.close()
        # 2. one pad, VS CPU via NF_INPUT
        pg=await page(b);ev=pg.evaluate
        async def press(i,pad=0,ms=110):
            await ev(f"__pads[{pad}].buttons[{i}]={{pressed:true,value:1}}");await pg.wait_for_timeout(ms);await ev(f"__pads[{pad}].buttons[{i}]={{pressed:false,value:0}}");await pg.wait_for_timeout(110)
        async def setb(i,v,pad=0):await ev(f"__pads[{pad}].buttons[{i}]={{pressed:{'true' if v else 'false'},value:{1 if v else 0}}}");await pg.wait_for_timeout(160)
        await ev('__n=1');await pg.wait_for_timeout(300)
        await press(0);ok('pad: title A -> menu',await ev('mode')=='menu' and not await ev('VS2'))
        await press(0);await press(0);await pg.wait_for_function('mode=="play"',timeout=90000)
        await setb(15,1);ok('pad cpu: right',await ev('A.in.r')==1);await setb(15,0);ok('pad cpu: release',await ev('A.in.r')==0)
        await setb(1,1);ok('pad cpu: guard',await ev('A.in.g')==1);await setb(1,0)
        await pg.wait_for_timeout(300);await ev("B.x=620;A.x=200;A.st='i';A.gcd=0");await ev("__pads[0].buttons[2]={pressed:true,value:1}");await pg.wait_for_timeout(50);r=await ev('A.st+":"+A.ty');await ev("__pads[0].buttons[2]={pressed:false,value:0}");ok('pad cpu: X weak ('+r+')',r=='atk:L')
        await pg.wait_for_timeout(700)
        await ev("B.x=620;A.x=200;A.st='i';A.gcd=0");await setb(3,1);r=await ev('A.c.n+":"+A.in.hx+":"+A.st+":"+A.ty');ok('pad: hold Y sets charge + heavy ('+r+')',r=='ブレイズ:1:atk:H')
        await pg.wait_for_timeout(700);r2=await ev('A.st+":"+(A.cg||0)');await setb(3,0);ok('pad: release Y clears charge ('+r2+')',await ev('A.in.hx')==0)
        await pg.wait_for_timeout(900);await ev("B.x=620;A.x=200;A.st='i'");await ev("__pads[0].buttons[3]={pressed:true,value:1}");await pg.wait_for_timeout(40);await ev("__pads[0].buttons[3]={pressed:false,value:0}");await pg.wait_for_timeout(120);ok('pad: tap Y leaves no charge held',await ev('A.in.hx')==0)
        await pg.wait_for_timeout(900)
        # keyboard still works while an idle pad is connected
        await pg.keyboard.down('ArrowLeft');await pg.wait_for_timeout(250);ok('idle pad does not override keyboard',await ev('A.in.l')==1);await pg.keyboard.up('ArrowLeft')
        await press(9);ok('pad: START pause',await ev('paused')==True)
        await ev("B.x=620;A.x=200");await setb(0,1);await pg.wait_for_timeout(200);r=await ev('paused+":"+A.st+":"+A.ty');await setb(0,0);ok('pause: A resumes without throwing ('+r+')',r.startswith('false') and not r.endswith('atk:T'))
        ok('no errors (pad cpu)',pg.errs==[]);await pg.context.close()
        # 3. two pads, 2-player
        pg=await page(b);ev=pg.evaluate
        await ev('__n=2');await pg.wait_for_timeout(300)
        await press(2);ok('pad: title X -> 2P menu',await ev('mode')=='menu' and await ev('VS2')==True)
        for _ in range(6):
            if await ev('mode')!='menu':break
            await press(0)
        await pg.wait_for_function('mode=="play"',timeout=90000);ok('2P: B is human',await ev('B.cpu')==False)
        await setb(15,1,1);ok('2P: pad2 right moves 2P only',await ev('B.in.r')==1 and await ev('A.in.r')==0);await setb(15,0,1)
        await setb(14,1,0);ok('2P: pad1 left moves 1P only',await ev('A.in.l')==1 and await ev('B.in.l')==0);await setb(14,0,0)
        await setb(1,1,1);ok('2P: pad2 guard',await ev('B.in.g')==1 and await ev('A.in.g')==0);await setb(1,0,1)
        await pg.wait_for_timeout(400);await ev("A.x=150;B.x=600;A.st='i';B.st='i';A.gcd=0;B.gcd=0")
        await ev("__pads[1].buttons[3]={pressed:true,value:1}");await pg.wait_for_timeout(50);r=await ev('A.st+"/"+B.st+":"+B.ty');await ev("__pads[1].buttons[3]={pressed:false,value:0}");ok('2P: pad2 Y heavy ('+r+')',r.startswith('i/atk:H'))
        await pg.wait_for_timeout(900);await ev("A.x=150;B.x=600;A.st='i';B.st='i'")
        await ev("__pads[0].buttons[2]={pressed:true,value:1}");await pg.wait_for_timeout(50);r=await ev('A.st+":"+A.ty+"/"+B.st');await ev("__pads[0].buttons[2]={pressed:false,value:0}");ok('2P: pad1 X weak ('+r+')',r.startswith('atk:L/i'))
        await pg.keyboard.down('d');await pg.wait_for_timeout(250);ok('2P: keyboard D still moves 1P',await ev('A.in.r')==1);await pg.keyboard.up('d')
        await ev('B.rw=1;A.hp=0;ko(A)');await pg.wait_for_function('mode=="end"',timeout=90000);await pg.wait_for_timeout(600)
        href=urllib.parse.unquote(await ev("[...document.querySelectorAll('a')].find(a=>a.textContent.includes('シェア')).href"));print('  share:',href[40:130]);ok('2P share text says 2P wins',('2P の勝ち' in href))
        await pg.screenshot(path=OUT+'/end_2p.png')
        e=nfa(pg);ok('2P events: mode=vs2p',any(x['_']=='match_start' and x.get('mode')=='vs2p' for x in e));ok('no errors (2P)',pg.errs==[])
        await pg.context.close()
        # 4. English
        pg=await page(b,lang='en-US');ev=pg.evaluate;await pg.wait_for_timeout(500)
        ok('en: LANG en',await ev('LANG')=='en');ok('en: link label',await ev("[...document.querySelectorAll('a')].map(a=>a.textContent).join('|')")=='Privacy|Share on X')
        await pg.screenshot(path=OUT+'/title_en.png')
        await ev('__n=1');await pg.wait_for_timeout(400);await pg.screenshot(path=OUT+'/title_en_toast.png')
        await ev('start()');await pg.wait_for_function('mode=="play"',timeout=90000);await ev('A.rw=1;B.hp=0;ko(B)');await pg.wait_for_function('mode=="end"',timeout=90000);await pg.wait_for_timeout(600)
        href=urllib.parse.unquote(await ev("[...document.querySelectorAll('a')].find(a=>a.textContent.includes('Share')).href"));print('  share:',href[40:130]);ok('en share text',href.split('text=')[1].startswith('Beat ') and all(ord(c)<128 for c in href.split('text=')[1].split('&url')[0]))
        ok('no errors (en)',pg.errs==[]);await pg.context.close()
        # 5. tight window + touch
        pg=await page(b,680,640);await pg.screenshot(path=OUT+'/title_tight.png');await pg.context.close()
        pg=await page(b,844,390,touch=True);await pg.screenshot(path=OUT+'/title_touch.png');ok('no errors (touch)',pg.errs==[]);await pg.context.close()
        pg=await page(b,680,640);ev=pg.evaluate;cv=pg.locator('canvas')
        await ev("tutM=false;VS2=false;msub=0;ch=10;mode='menu'");await pg.wait_for_timeout(2500);await cv.screenshot(path=OUT+'/select.png')
        await ev("ch=10;selC=6;selV=3;lv=4;SPECT=true;start()");await pg.wait_for_function('mode=="play"',timeout=90000)
        for k in range(8):
            await pg.wait_for_timeout(1200);await cv.screenshot(path=OUT+f'/tsu_{k}.png')
        ok('no errors (tsurara)',pg.errs==[]);await pg.context.close()
        pg=await page(b,844,390,touch=True);ev=pg.evaluate
        await ev("tutM=false;VS2=false;msub=0;ch=10;mode='menu'");await pg.wait_for_timeout(1500);await pg.screenshot(path=OUT+'/select_touch.png');await pg.context.close()
        await b.close();print('FAILS:',fails)
asyncio.run(main())
sys.exit(1 if fails else 0)
