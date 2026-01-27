'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Trophy, RefreshCw, Check, X, Clock, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

// 成语库
const idiomDatabase: string[] = [
  // 第一组（1-100）
  '一马当先', '先声夺人', '人山人海', '海阔天空', '空穴来风',
  '风吹草动', '动如脱兔', '兔死狐悲', '悲天悯人', '人定胜天',
  '天长地久', '久别重逢', '逢凶化吉', '吉祥如意', '意气风发',
  '发扬光大', '大材小用', '用兵如神', '神机妙算', '算无遗策',
  '策马奔腾', '腾云驾雾', '雾里看花', '花好月圆', '圆满成功',
  '功成名就', '就地取材', '材高知深', '深入浅出', '出生入死',
  '死里逃生', '生龙活虎', '虎口余生', '生财有道', '道听途说',
  '说三道四', '四面楚歌', '歌舞升平', '平易近人', '人杰地灵',
  '灵丹妙药', '药到病除', '除暴安良', '良莠不齐', '齐心协力',
  '力不从心', '心花怒放', '放虎归山', '山高水长', '长驱直入',
  '入木三分', '分秒必争', '争先恐后', '后来居上', '上善若水',
  '水滴石穿', '穿云裂石', '石破天惊', '惊天动地', '地动山摇',
  '摇身一变', '变化无常', '常胜将军', '军令如山', '山清水秀',
  '秀色可餐', '餐风露宿', '宿弊一清', '清尘浊水', '水落石出',
  '出人头地', '地大物博', '博大精深', '深明大义', '义薄云天',
  '天长地久', '久负盛名', '名正言顺', '顺水人情', '情投意合',
  '合二为一', '一视同仁', '仁至义尽', '尽善尽美', '美中不足',
  '足智多谋', '谋财害命', '命途多舛', '舛讹百出', '出生入死',
  '死里逃生', '生龙活虎', '虎背熊腰', '腰缠万贯', '贯朽粟陈',
  '陈词滥调', '调虎离山', '山高水长', '长驱直入', '入木三分',
  
  // 第二组（101-200）
  '分秒必争', '争先恐后', '后发制人', '人定胜天', '天罗地网',
  '网开一面', '面目全非', '非同小可', '可歌可泣', '泣不成声',
  '声东击西', '西装革履', '履险如夷', '夷为平地', '地动山摇',
  '摇头摆尾', '尾大不掉', '掉以轻心', '心灰意冷', '冷嘲热讽',
  '讽一劝百', '百折不挠', '挠喉捩嗓', '嗓音沙哑', '哑口无言',
  '言而无信', '信口雌黄', '黄粱一梦', '梦寐以求', '求同存异',
  '异曲同工', '工力悉敌', '敌众我寡', '寡不敌众', '众志成城',
  '城门失火', '火上浇油', '油腔滑调', '调兵遣将', '将计就计',
  '计上心来', '来历不明', '明目张胆', '胆大包天', '天翻地覆',
  '覆水难收', '收回成命', '命若悬丝', '丝丝入扣', '扣人心弦',
  '弦外之音', '音容笑貌', '貌合神离', '离经叛道', '道听途说',
  '说三道四', '四面楚歌', '歌功颂德', '德高望重', '重蹈覆辙',
  '辙乱旗靡', '靡靡之音', '音信全无', '无中生有', '有始无终',
  '终南捷径', '径情直遂', '遂心如意', '意气风发', '发人深省',
  '省吃俭用', '用兵如神', '神气活现', '现身说法', '法不容情',
  '情理之中', '中流砥柱', '柱石之坚', '坚如磐石', '石破天惊',
  '惊天动地', '地大物博', '博古通今', '今非昔比', '比比皆是',
  '是非分明', '明察秋毫', '毫无保留', '留有余地', '地广人稀',
  '稀奇古怪', '怪诞不经', '经久不衰', '衰当益壮', '壮志凌云',
  '云开见日', '日新月异', '异想天开', '开天辟地', '地久天长',
  
  // 第三组（201-300）
  '长命百岁', '岁寒三友', '友风子雨', '雨过天晴', '晴云秋月',
  '月黑风高', '高风亮节', '节外生枝', '枝繁叶茂', '茂林修竹',
  '竹报平安', '安贫乐道', '道貌岸然', '然荻读书', '书声琅琅',
  '琅琅上口', '口若悬河', '河清海晏', '晏然自若', '若无其事',
  '事在人为', '为人师表', '表里如一', '一步登天', '天壤之别',
  '别具匠心', '心花怒放', '放虎归山', '山穷水尽', '尽如人意',
  '意气相投', '投其所好', '好高骛远', '远见卓识', '识文断字',
  '字斟句酌', '酌盈剂虚', '虚情假意', '意气风发', '发愤图强',
  '强词夺理', '理直气壮', '壮志未酬', '酬功给效', '效颦学步',
  '步履维艰', '艰苦卓绝', '绝处逢生', '生离死别', '别开生面',
  '面目一新', '新陈代谢', '谢天谢地', '地动山摇', '摇头晃脑',
  '脑满肠肥', '肥头大耳', '耳闻目睹', '睹物思人', '人杰地灵',
  '灵机一动', '动人心弦', '弦外之音', '音容宛在', '在劫难逃',
  '逃之夭夭', '夭桃秾李', '李代桃僵', '僵李代桃', '桃红柳绿',
  '绿水青山', '山清水秀', '秀色可餐', '餐风宿露', '露宿风餐',
  '餐风饮露', '露餐风宿', '宿露餐风', '风餐露宿', '宿雨餐风',
  '风吹雨打', '打草惊蛇', '蛇蝎心肠', '肠肥脑满', '满腔热忱',
  '忱恂拳拳', '拳拳服膺', '膺箓受图', '图谋不轨', '轨物范世',
  '世风日下', '下里巴人', '人才辈出', '出类拔萃', '萃出群贤',
  '贤良方正', '正心诚意', '意气相投', '投鼠忌器', '器宇轩昂',
  
  // 第四组（301-400）
  '昂首挺胸', '胸有成竹', '竹篮打水', '水滴石穿', '穿云裂石',
  '石沉大海', '海枯石烂', '烂熟于心', '心直口快', '快人快语',
  '语重心长', '长吁短叹', '叹为观止', '止谈风月', '月明星稀',
  '稀世之宝', '宝刀不老', '老当益壮', '壮志凌云', '云谲波诡',
  '诡计多端', '端本正源', '源清流洁', '洁身自好', '好景不长',
  '长命百岁', '岁暮天寒', '寒来暑往', '往古来今', '今是昨非',
  '非分之想', '想入非非', '非同小可', '可有可无', '无足轻重',
  '重蹈覆辙', '辙乱旗靡', '靡不有初', '初生牛犊', '犊牧采薪',
  '薪尽火传', '传宗接代', '代人受过', '过目不忘', '忘乎所以',
  '以偏概全', '全力以赴', '赴汤蹈火', '火树银花', '花言巧语',
  '语焉不详', '详情度理', '理屈词穷', '穷途末路', '路不拾遗',
  '遗臭万年', '年深日久', '久别重逢', '逢凶化吉', '吉人天相',
  '相敬如宾', '宾至如归', '归心似箭', '箭在弦上', '上蹿下跳',
  '跳梁小丑', '丑态百出', '出人头地', '地广人稀', '稀奇古怪',
  '怪模怪样', '样样俱全', '全神贯注', '注玄尚白', '白驹过隙',
  '隙大墙坏', '坏人坏事', '事半功倍', '倍道而行', '行尸走肉',
  '肉袒面缚', '缚鸡之力', '力不从心', '心花怒放', '放任自流',
  '流言蜚语', '语不惊人', '人仰马翻', '翻云覆雨', '雨过天晴',
  '晴天霹雳', '雳声四震', '震耳欲聋', '聋者之歌', '歌功颂德',
  '德艺双馨', '馨香祷祝', '祝发文身', '身经百战', '战无不胜',
  
  // 第五组（401-500）
  '胜任愉快', '快马加鞭', '鞭长莫及', '及笄年华', '华而不实',
  '实至名归', '归真返璞', '璞玉浑金', '金石为开', '开诚布公',
  '公正无私', '私心杂念', '念念不忘', '忘年之交', '交头接耳',
  '耳濡目染', '染苍染黄', '黄粱一梦', '梦寐以求', '求贤若渴',
  '渴而穿井', '井底之蛙', '蛙鸣蝉噪', '噪声污染', '染蓝涅皂',
  '皂白不分', '分道扬镳', '镳扬分路', '路见不平', '平易近人',
  '人心所向', '向隅而泣', '泣不成声', '声泪俱下', '下不为例',
  '例行公事', '事不宜迟', '迟暮之年', '年富力强', '强弩之末',
  '末路穷途', '途遥日暮', '暮鼓晨钟', '钟鸣鼎食', '食古不化',
  '化为乌有', '有口无心', '心猿意马', '马到成功', '功成名就',
  '就事论事', '事在人为', '为富不仁', '仁义道德', '德高望重',
  '重见天日', '日新月异', '异想天开', '开门见山', '山清水秀',
  '秀色可餐', '餐风饮露', '露往霜来', '来去分明', '明察秋毫',
  '毫发无伤', '伤筋动骨', '骨肉相连', '连绵不断', '断章取义',
  '义薄云天', '天长地久', '久别重逢', '逢山开路', '路不拾遗',
  '遗世独立', '立竿见影', '影影绰绰', '绰绰有余', '余音绕梁',
  '梁上君子', '子虚乌有', '有备无患', '患难与共', '共商国是',
  '是非曲直', '直言不讳', '讳莫如深', '深入浅出', '出其不意',
  '意气风发', '发扬光大', '大材小用', '用武之地', '地大物博',
  '博采众长', '长驱直入', '入木三分', '分庭抗礼', '礼尚往来',
  
  // 第六组（501-600）
  '来之不易', '易如反掌', '掌上明珠', '珠联璧合', '合浦珠还',
  '还淳返朴', '朴实无华', '华而不实', '实心实意', '意气相投',
  '投桃报李', '李代桃僵', '僵桃代李', '李广难封', '封妻荫子',
  '子承父业', '业精于勤', '勤能补拙', '拙嘴笨舌', '舌战群儒',
  '儒雅风流', '流芳百世', '世代相传', '传为佳话', '话中有话',
  '话不投机', '机不可失', '失之交臂', '臂有四肘', '肘腋之患',
  '患难之交', '交相辉映', '映雪读书', '书声琅琅', '琅琅上口',
  '口诛笔伐', '伐功矜能', '能说会道', '道听途说', '说长道短',
  '短兵相接', '接踵而至', '至死不渝', '渝盟毁约', '约法三章',
  '章台杨柳', '柳暗花明', '明目张胆', '胆大包天', '天经地义',
  '义不容辞', '辞旧迎新', '新陈代谢', '谢天谢地', '地老天荒',
  '荒诞不经', '经久不衰', '衰草连天', '天长地久', '久旱逢甘雨',
  '雨过天晴', '晴天霹雳', '雳声四震', '震古烁今', '今非昔比',
  '比比皆是', '是非分明', '明辨是非', '非此即彼', '此起彼伏',
  '伏地圣人', '人心向背', '背水一战', '战战兢兢', '兢兢业业',
  '业精于勤', '勤勤恳恳', '恳恳勤勤', '勤劳勇敢', '敢作敢为',
  '为所欲为', '为非作歹', '歹毒心肠', '肠回气荡', '荡气回肠',
  '肠肥脑满', '满面春风', '风花雪月', '月朗星稀', '稀世之宝',
  '宝刀未老', '老当益壮', '壮志凌云', '云蒸霞蔚', '蔚为壮观',
  '观者如堵', '堵截搜寻', '寻踪觅迹', '迹象可疑', '疑神疑鬼',
  
  // 第七组（601-700）
  '鬼斧神工', '工欲善其事', '事半功倍', '倍道兼行', '行不苟合',
  '合二为一', '一分为二', '二龙戏珠', '珠光宝气', '气宇轩昂',
  '昂首挺胸', '胸无点墨', '墨守成规', '规行矩步', '步人后尘',
  '尘埃落定', '定国安邦', '邦国殄瘁', '瘁力不足', '足不出户',
  '户枢不蠹', '蠹国殃民', '民不聊生', '生不如死', '死不瞑目',
  '目不识丁', '丁是丁', '卯是卯', '卯金刀', '刀光剑影',
  '影影绰绰', '绰约多姿', '姿意妄为', '为富不仁', '仁至义尽',
  '尽善尽美', '美轮美奂', '焕然一新', '新陈代谢', '谢家宝树',
  '树大根深', '深恶痛绝', '绝处逢生', '生龙活虎', '虎踞龙盘',
  '盘根错节', '节外生枝', '枝繁叶茂', '茂林修竹', '竹苞松茂',
  '茂实英声', '声威大震', '震耳欲聋', '聋者之歌', '歌台舞榭',
  '榭歌台', '台阁生风', '风和日丽', '丽藻春葩', '葩经',
  '经天纬地', '地覆天翻', '翻云覆雨', '雨打风吹', '吹毛求疵',
  '疵瑕指斥', '斥卤之地', '地广人稀', '稀世奇珍', '珍藏密敛',
  '敛声屏气', '气冲牛斗', '斗转星移', '移花接木', '木本水源',
  '源远流长', '长歌当哭', '哭天喊地', '地老天荒', '荒无人烟',
  '烟消云散', '散兵游勇', '勇猛精进', '进德修业', '业精于勤',
  '勤能补拙', '拙嘴笨舌', '舌敝唇焦', '焦头烂额', '额手称庆',
  '庆吊不行', '行将就木', '木已成舟', '舟车劳顿', '顿足捶胸',
  '胸有成竹', '竹报平安', '安居乐业', '业精于勤', '勤勤恳恳',
  
  // 第八组（701-800）
  '恳恳之忱', '忱辞恳切', '切肤之痛', '痛定思痛', '痛心疾首',
  '首屈一指', '指日可待', '待价而沽', '沽名钓誉', '誉满天下',
  '下里巴人', '人才济济', '济济一堂', '堂堂正正', '正大光明',
  '明争暗斗', '斗志昂扬', '扬眉吐气', '气吞山河', '河清海晏',
  '晏子使楚', '楚材晋用', '用非所学', '学富五车', '车载斗量',
  '量体裁衣', '衣锦还乡', '乡党邻里', '里应外合', '合浦珠还',
  '还年却老', '老谋深算', '算无遗策', '策马扬鞭', '鞭辟入里',
  '里通外国', '国泰民安', '安之若素', '素昧平生', '生财有道',
  '道听途说', '说三道四', '四面楚歌', '歌声绕梁', '梁上君子',
  '子虚乌有', '有目共睹', '睹物思人', '人云亦云', '云谲波诡',
  '诡计多端', '端端正正', '正大光明', '明察秋毫', '毫无顾忌',
  '忌贤妒能', '能屈能伸', '伸缩自如', '如鱼得水', '水乳交融',
  '融为一体', '体无完肤', '肤皮潦草', '草长莺飞', '飞短流长',
  '长驱直入', '入不敷出', '出人头地', '地动山摇', '摇尾乞怜',
  '怜香惜玉', '玉成其事', '事与愿违', '违法乱纪', '纪纲人论',
  '论功行赏', '赏心悦目', '目不暇接', '接二连三', '三心二意',
  '意气风发', '发扬光大', '大器晚成', '成竹在胸', '胸无城府',
  '城府深沉', '沉鱼落雁', '雁过留声', '声东击西', '西风残照',
  '照本宣科', '科头跣足', '足不出户', '户枢不蠹', '蠹国害民',
  '民脂民膏', '膏腴之地', '地广人稀', '稀稀拉拉', '拉帮结派',
  
  // 第九组（801-900）
  '派头十足', '足智多谋', '谋事在人', '人定胜天', '天塌地陷',
  '陷入困境', '镜花水月', '月黑风高', '高山流水', '水滴石穿',
  '穿云裂石', '石破天惊', '惊天动地', '地动山摇', '摇头摆尾',
  '尾生抱柱', '柱石之坚', '坚韧不拔', '拔苗助长', '长驱直入',
  '入木三分', '分秒必争', '争先恐后', '后继有人', '人杰地灵',
  '灵机一动', '动魄惊心', '心直口快', '快人快语', '语重心长',
  '长话短说', '说一不二', '二龙戏珠', '珠圆玉润', '润笔之资',
  '资不抵债', '债台高筑', '筑室道谋', '谋事在人', '人浮于事',
  '事倍功半', '半信半疑', '疑神疑鬼', '鬼使神差', '差强人意',
  '意气风发', '发奸擿伏', '伏法受诛', '诛心之论', '论古谈今',
  '今非昔比', '比翼双飞', '飞蛾扑火', '火中取栗', '栗栗危惧',
  '据理力争', '争分夺秒', '妙趣横生', '生离死别', '别具一格',
  '格物致知', '知难而进', '进退两难', '难能可贵', '贵人多忘事',
  '事必躬亲', '亲力亲为', '为所欲为', '为非作歹', '歹毒心肠',
  '肠回气荡', '荡气回肠', '肠肥脑满', '满面春风', '风调雨顺',
  '顺藤摸瓜', '瓜熟蒂落', '落花流水', '水到渠成', '成人之美',
  '美轮美奂', '焕然一新', '新陈代谢', '谢天谢地', '地广人稀',
  '稀世珍宝', '宝马香车', '车水马龙', '龙马精神', '神采飞扬',
  '扬长避短', '短兵相接', '接风洗尘', '尘饭涂羹', '羹藜含糗',
  '糗事百科', '科班出身', '身经百战', '战无不胜', '胜任愉快',
  
  // 第十组（901-1000）
  '快马加鞭', '鞭长莫及', '及时行乐', '乐极生悲', '悲天悯人',
  '人云亦云', '云开见日', '日理万机', '机不可失', '失之交臂',
  '臂有四肘', '肘腋之患', '患得患失', '失而复得', '得心应手',
  '手不释卷', '卷土重来', '来者不拒', '拒人于千里之外', '外强中干',
  '干云蔽日', '日新月异', '异想天开', '开门见山', '山高水长',
  '长命百岁', '岁月如歌', '歌功颂德', '德高望重', '重蹈覆辙',
  '辙乱旗靡', '靡不有初', '初心不改', '改邪归正', '正大光明',
  '明目张胆', '胆战心惊', '惊弓之鸟', '鸟语花香', '香消玉殒',
  '殒身不恤', '恤老怜贫', '贫贱不移', '移花接木', '木已成舟',
  '舟车劳顿', '顿足捶胸', '胸有丘壑', '壑谷幽深', '深入浅出',
  '出类拔萃', '萃取出群', '群策群力', '力挽狂澜', '澜倒波随',
  '随波逐流', '流光溢彩', '彩笔生花', '花容月貌', '貌合神离',
  '离经叛道', '道貌岸然', '然荻读书', '书声琅琅', '琅琅上口',
  '口若悬河', '河清海晏', '晏然自若', '若无其事', '事在人为',
  '为人师表', '表里如一', '一目了然', '然糠自照', '照本宣科',
  '科头跣足', '足不出户', '户枢不蠹', '蠹国害民', '民脂民膏',
  '膏腴之地', '地广人稀', '稀奇古怪', '怪诞不经', '经久不衰',
  '衰草寒烟', '烟消云散', '散闷消愁', '愁眉不展', '展眼舒眉',
  '眉开眼笑', '笑逐颜开', '开诚布公', '公而忘私', '私心杂念',
  '念念不忘', '忘乎所以', '以卵击石', '石沉大海', '海纳百川'
]

interface IdiomGameProps {
  className?: string
}

export function IdiomGame({ className }: IdiomGameProps) {
  const [gameState, setGameState] = React.useState<{
    currentIdiom: string
    usedIdioms: Set<string>
    score: number
    time: number
    isPlaying: boolean
    message: string
    messageType: 'info' | 'success' | 'error'
    inputValue: string
  }>({
    currentIdiom: '',
    usedIdioms: new Set(),
    score: 0,
    time: 60,
    isPlaying: false,
    message: '点击开始按钮开始游戏',
    messageType: 'info',
    inputValue: ''
  })

  // 定时器
  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (gameState.isPlaying && gameState.time > 0) {
      timer = setInterval(() => {
        setGameState(prev => {
          if (prev.time <= 1) {
            if (timer) clearInterval(timer)
            return {
              ...prev,
              isPlaying: false,
              time: 0,
              message: `游戏结束！你的得分是：${prev.score}`,
              messageType: 'info'
            }
          }
          return {
            ...prev,
            time: prev.time - 1
          }
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [gameState.isPlaying, gameState.time])

  // 开始游戏
  const startGame = () => {
    const randomIdiom = idiomDatabase[Math.floor(Math.random() * idiomDatabase.length)]
    setGameState({
      currentIdiom: randomIdiom,
      usedIdioms: new Set([randomIdiom]),
      score: 0,
      time: 60,
      isPlaying: true,
      message: `游戏开始！请接：${randomIdiom}`,
      messageType: 'info',
      inputValue: ''
    })
  }

  // 检查成语是否有效
  const checkIdiom = (input: string): boolean => {
    // 检查是否是成语
    if (!idiomDatabase.includes(input)) {
      return false
    }

    // 检查是否已使用
    if (gameState.usedIdioms.has(input)) {
      return false
    }

    // 检查首字是否与前一个成语的末字相同
    if (gameState.currentIdiom) {
      const lastChar = gameState.currentIdiom.charAt(gameState.currentIdiom.length - 1)
      const firstChar = input.charAt(0)
      if (lastChar !== firstChar) {
        return false
      }
    }

    return true
  }

  // 提交答案
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!gameState.isPlaying) {
      return
    }

    const input = gameState.inputValue.trim()

    if (!input) {
      setGameState(prev => ({
        ...prev,
        message: '请输入成语',
        messageType: 'error'
      }))
      return
    }

    if (checkIdiom(input)) {
      // 找到下一个成语（AI回答）
      const nextIdiom = findNextIdiom(input, gameState.usedIdioms)

      if (nextIdiom) {
        setGameState(prev => {
          const newUsedIdioms = new Set(prev.usedIdioms)
          newUsedIdioms.add(input)
          newUsedIdioms.add(nextIdiom)

          return {
            ...prev,
            currentIdiom: nextIdiom,
            usedIdioms: newUsedIdioms,
            score: prev.score + 10,
            time: Math.min(prev.time + 5, 60), // 奖励时间
            message: `正确！AI接：${nextIdiom}`,
            messageType: 'success',
            inputValue: ''
          }
        })
      } else {
        // AI无法接，游戏结束
        setGameState(prev => {
          const newUsedIdioms = new Set(prev.usedIdioms)
          newUsedIdioms.add(input)

          return {
            ...prev,
            isPlaying: false,
            usedIdioms: newUsedIdioms,
            score: prev.score + 20, // 额外奖励
            message: `恭喜！AI无法接你的成语，你赢了！得分：${prev.score + 20}`,
            messageType: 'success'
          }
        })
      }
    } else {
      // 检查具体错误
      if (gameState.usedIdioms.has(input)) {
        setGameState(prev => ({
          ...prev,
          message: '这个成语已经使用过了',
          messageType: 'error'
        }))
      } else if (gameState.currentIdiom) {
        const lastChar = gameState.currentIdiom.charAt(gameState.currentIdiom.length - 1)
        const firstChar = input.charAt(0)
        if (lastChar !== firstChar) {
          setGameState(prev => ({
            ...prev,
            message: `成语首字必须是"${lastChar}"`,
            messageType: 'error'
          }))
        } else {
          setGameState(prev => ({
            ...prev,
            message: '不是有效的成语',
            messageType: 'error'
          }))
        }
      } else {
        setGameState(prev => ({
          ...prev,
          message: '不是有效的成语',
          messageType: 'error'
        }))
      }
    }
  }

  // 查找下一个成语
  const findNextIdiom = (currentIdiom: string, usedIdioms: Set<string>): string | null => {
    const lastChar = currentIdiom.charAt(currentIdiom.length - 1)

    // 从成语库中找到以lastChar开头且未使用过的成语
    const possibleIdioms = idiomDatabase.filter(
      idiom => idiom.charAt(0) === lastChar && !usedIdioms.has(idiom)
    )

    if (possibleIdioms.length > 0) {
      // 随机选择一个
      return possibleIdioms[Math.floor(Math.random() * possibleIdioms.length)]
    }

    return null
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          成语接龙
        </CardTitle>
        <CardDescription>
          与AI进行成语接龙比赛，看看谁更厉害！
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 游戏状态 */}
        <div className="space-y-4">
          {/* 分数和时间 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">分数: {gameState.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className={`font-semibold ${gameState.time < 10 ? 'text-red-500' : ''}`}>
                时间: {gameState.time}s
              </span>
            </div>
          </div>

          {/* 当前成语 */}
          {gameState.currentIdiom && (
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-center font-bold text-lg">
                当前成语: <span className="text-primary">{gameState.currentIdiom}</span>
              </p>
            </div>
          )}

          {/* 消息 */}
          <Alert variant={gameState.messageType === 'error' ? 'destructive' : gameState.messageType === 'success' ? 'default' : 'info'}>
            <AlertDescription>{gameState.message}</AlertDescription>
          </Alert>

          {/* 游戏区域 */}
          {gameState.isPlaying ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idiom-input">请输入成语</Label>
                <Input
                  id="idiom-input"
                  type="text"
                  value={gameState.inputValue}
                  onChange={(e) => setGameState(prev => ({ ...prev, inputValue: e.target.value }))}
                  placeholder="请输入成语"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full">
                <Check className="h-4 w-4 mr-2" />
                提交
              </Button>
            </form>
          ) : (
            <Button onClick={startGame} className="w-full" size="lg">
              <RefreshCw className="h-5 w-5 mr-2" />
              开始游戏
            </Button>
          )}

          {/* 游戏规则 */}
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">游戏规则：</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              <li>成语首字必须与前一个成语的末字相同</li>
              <li>不能使用重复的成语</li>
              <li>每答对一题得10分，奖励5秒时间</li>
              <li>如果AI无法接你的成语，你赢了！</li>
              <li>时间耗尽游戏结束</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
