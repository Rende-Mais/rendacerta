import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '@/components/ui/AppIcon';
import { Colors, shadows } from '@/constants/colors';

export default function SobreRendeMais() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
        <AppIcon name="arrow-left" size={22} color={Colors.neutral[700]} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Sobre o Rende Mais</Text>
        <Text style={styles.subtitle}>Política de Privacidade e Termos de Uso</Text>
      </View>

      <View style={styles.card}>


        <Text style={styles.sectionTitle}>Dados e informações</Text>
        <Text style={styles.body}>
          Taxas e simulações são aproximadas e podem variar. As informações não constituem
          recomendação de investimento e não substituem orientação profissional.
        </Text>

        <Text style={styles.sectionTitle}>Marcas e créditos</Text>
        <Text style={styles.body}>
          As marcas e logotipos citados pertencem aos seus respectivos proprietários. Caso haja
          alguma solicitação de uso, entre em contato com a equipe do Rende Mais.
        </Text>

        <Text style={styles.sectionTitle}>Uso e licença</Text>
        <Text style={styles.body}>
          **Política de Privacidade**
          Última atualização: março de 2025.

          O Rende Mais é um aplicativo informativo criado para ajudar usuários a visualizar e comparar taxas de rendimento de produtos de renda fixa oferecidos por instituições financeiras brasileiras. O aplicativo não é um banco, corretora ou plataforma de investimentos, não realiza operações financeiras em nome do usuário e não possui acesso a contas bancárias ou dados sensíveis. Seu objetivo é organizar informações públicas de forma clara para facilitar a comparação entre diferentes opções disponíveis no mercado.

          Para que o aplicativo funcione, um pequeno conjunto de informações técnicas é coletado. No primeiro uso, o usuário responde a algumas perguntas simples que ajudam a definir um perfil de investimento. Essas perguntas tratam da faixa aproximada do valor que o usuário pretende investir, da preferência de liquidez e da prioridade entre maior rendimento ou maior segurança associada à cobertura do Fundo Garantidor de Créditos. As respostas são armazenadas de forma técnica e vinculadas apenas a um identificador interno do sistema, sem associação direta a dados pessoais identificáveis.

          O aplicativo também registra eventos de interação quando o usuário seleciona uma instituição financeira dentro da interface. Esse registro inclui informações como o identificador da instituição exibida, a taxa de rendimento mostrada no momento da interação e o horário em que o evento ocorreu. Esses registros são utilizados para fins operacionais relacionados ao funcionamento do aplicativo, incluindo estatísticas agregadas de uso e gestão de redirecionamentos para instituições financeiras.

          O Rende Mais não solicita informações como nome, CPF, e-mail, número de telefone, endereço ou documentos pessoais. O aplicativo também não acessa contatos, câmera ou arquivos do dispositivo e não realiza leitura de dados de outros aplicativos instalados. O funcionamento do aplicativo depende apenas das informações declaradas pelo próprio usuário durante o uso e de eventos técnicos gerados dentro da própria interface.

          As informações coletadas são utilizadas para organizar e apresentar as opções exibidas no aplicativo de forma mais relevante. O perfil informado permite que o sistema destaque produtos financeiros que estejam mais alinhados com as preferências indicadas pelo usuário. Os registros de interação ajudam a compreender padrões de uso do aplicativo e permitem o funcionamento de integrações técnicas que direcionam o usuário para as páginas das instituições financeiras correspondentes.

          Os dados necessários ao funcionamento do aplicativo são armazenados em infraestrutura de banco de dados em nuvem fornecida por serviços especializados utilizados pelo sistema. Esses provedores atuam como infraestrutura técnica para armazenamento e processamento das informações necessárias ao funcionamento do aplicativo. Em situações relacionadas ao redirecionamento para instituições financeiras ou plataformas parceiras, identificadores técnicos de evento podem ser compartilhados com sistemas externos exclusivamente para validar registros operacionais relacionados a esses redirecionamentos.

          O aplicativo também pode exibir anúncios em sua versão gratuita por meio de plataformas de publicidade móvel, incluindo o Google AdMob. Essas plataformas podem coletar determinados dados técnicos de dispositivo ou interação dentro do aplicativo para entrega, medição e prevenção de fraude em anúncios. Além disso, o Rende Mais pode registrar eventos técnicos relacionados a impressões, cliques e desempenho das posições de anúncio exibidas dentro da interface. O tratamento dessas informações segue as políticas próprias dessas plataformas e os controles operacionais adotados pelo aplicativo.

          Os dados relacionados ao perfil de investimento permanecem armazenados enquanto o aplicativo estiver em uso, pois são necessários para que o sistema continue apresentando resultados personalizados sem exigir que o usuário responda novamente às perguntas iniciais a cada acesso. Registros técnicos relacionados a interações e redirecionamentos podem ser mantidos por períodos adicionais necessários para análise estatística, funcionamento de integrações técnicas ou obrigações operacionais. Após esse período, esses registros podem ser excluídos ou anonimizados.

          Nos termos da Lei Geral de Proteção de Dados, o usuário possui direitos relacionados às informações tratadas pelo aplicativo. Entre esses direitos estão a confirmação da existência de tratamento de dados, o acesso às informações armazenadas, a correção de dados imprecisos, a solicitação de anonimização ou eliminação de dados quando aplicável e a obtenção de informações sobre eventuais compartilhamentos necessários ao funcionamento do serviço. Solicitações relacionadas a esses direitos podem ser realizadas pelos canais de suporte disponíveis no aplicativo.

          O Rende Mais adota medidas técnicas e organizacionais adequadas para proteger as informações armazenadas contra acesso não autorizado, perda acidental ou alteração indevida. Isso inclui o uso de conexões criptografadas para comunicação entre o aplicativo e seus servidores e controles de acesso aplicados à infraestrutura utilizada. Apesar dessas medidas, nenhum sistema digital pode garantir proteção absoluta contra todos os riscos existentes na internet.

          Esta política pode ser atualizada periodicamente para refletir mudanças nas funcionalidades do aplicativo, em requisitos legais ou em melhorias no funcionamento do serviço. Sempre que alterações relevantes ocorrerem, elas poderão ser comunicadas dentro do próprio aplicativo. O uso contínuo do serviço após essas alterações será interpretado como concordância com os termos atualizados.

          ---

          **Termos de Uso**
          Última atualização: março de 2025.

          Estes Termos de Uso regulam a utilização do aplicativo Rende Mais. Ao instalar, acessar ou utilizar o aplicativo, o usuário declara que leu e compreendeu as condições descritas neste documento e concorda com sua aplicação.

          O Rende Mais é um aplicativo voltado à consulta e comparação de taxas de rendimento de produtos de renda fixa vinculados ao CDI, como CDB, LCI, LCA e RDB. O aplicativo reúne informações disponibilizadas publicamente por instituições financeiras e as apresenta de forma organizada para facilitar a comparação entre diferentes opções disponíveis no mercado.

          O aplicativo não é uma instituição financeira, não atua como corretora de valores e não presta serviços de consultoria financeira ou recomendação personalizada de investimentos. As informações exibidas possuem caráter exclusivamente informativo e têm como finalidade auxiliar o usuário em sua pesquisa inicial sobre produtos financeiros.

          As taxas e condições apresentadas no aplicativo são obtidas de fontes públicas e podem ser alteradas a qualquer momento pelas instituições emissoras ou em razão de mudanças nas condições de mercado. Por esse motivo, o Rende Mais não garante que todas as informações exibidas estejam permanentemente atualizadas ou que as mesmas condições estarão disponíveis no momento em que o usuário acessar diretamente o site ou aplicativo da instituição financeira correspondente.

          A pontuação de recomendação exibida no aplicativo é um recurso visual que utiliza critérios simples baseados nas preferências informadas pelo usuário, como taxa, liquidez e cobertura do Fundo Garantidor de Créditos. Essa pontuação serve apenas como apoio à visualização e não constitui análise financeira profissional nem recomendação de investimento.

          Qualquer decisão de investimento tomada com base nas informações apresentadas no aplicativo é de responsabilidade exclusiva do usuário. O Rende Mais e seus desenvolvedores não se responsabilizam por perdas financeiras, resultados abaixo do esperado ou quaisquer consequências decorrentes do uso das informações disponibilizadas.

          O aplicativo pode manter relações comerciais com instituições financeiras por meio de programas de afiliados. Quando o usuário acessa o site ou aplicativo de uma instituição financeira por meio de um redirecionamento dentro do Rende Mais, pode existir a possibilidade de remuneração ao aplicativo caso determinadas ações ocorram posteriormente, como abertura de conta ou realização de um primeiro investimento. Essa relação comercial ajuda a sustentar o funcionamento do aplicativo.

          Ao acessar serviços de instituições financeiras externas, o usuário passa a estar sujeito às políticas, termos e procedimentos dessas instituições, que operam de forma independente do Rende Mais.

          O aplicativo é disponibilizado conforme disponível e pode sofrer interrupções temporárias devido a manutenção, atualizações, falhas técnicas ou alterações na infraestrutura utilizada. O desenvolvedor se reserva o direito de modificar funcionalidades, atualizar informações, alterar a forma de apresentação de dados ou introduzir novos recursos a qualquer momento.

          O usuário concorda em utilizar o aplicativo apenas para fins legítimos e de acordo com estes termos. Não é permitido tentar acessar partes do sistema sem autorização, realizar engenharia reversa do aplicativo, extrair dados de forma automatizada ou utilizar as informações disponibilizadas para finalidades comerciais não autorizadas.

          Todos os elementos do aplicativo, incluindo código, design, textos, logotipo e estrutura de funcionamento, são protegidos por direitos de propriedade intelectual e pertencem ao desenvolvedor do Rende Mais. O uso do aplicativo não concede ao usuário qualquer direito de reprodução, distribuição ou exploração desses elementos.

          Estes termos são regidos pelas leis da República Federativa do Brasil. Eventuais controvérsias relacionadas ao uso do aplicativo deverão ser resolvidas de acordo com a legislação brasileira aplicável.

          Os termos podem ser atualizados periodicamente para refletir mudanças no funcionamento do aplicativo ou em requisitos legais. O uso contínuo do Rende Mais após a publicação de alterações será interpretado como aceitação das condições atualizadas.

        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: Colors.neutral[950],
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[400],
    marginTop: 6,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
    gap: 12,
    ...shadows.card,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.neutral[700],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  body: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.neutral[500],
    lineHeight: 22,
  },
});
