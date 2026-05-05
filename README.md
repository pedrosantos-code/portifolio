# Guia de Configuração: Meu Portfólio Streamlit

Este repositório foi criado para centralizar e apresentar meus projetos de forma interativa. Este guia ensina como preparar o ambiente e colocar o site no ar.

📋 Pré-requisitos
Antes de começar, certifique-se de ter o Python instalado em sua máquina.

🛠️ Passo 1: Instalação das Dependências
Para que o projeto funcione, precisamos de bibliotecas específicas para interface, dados e imagens. Execute o comando abaixo no seu terminal:

Bash

pip install streamlit pandas Pillow plotly

Dica de mestre: Se você encontrar erros de permissão ou "comando não encontrado", tente usar:
python -m pip install streamlit pandas Pillow plotly

📂 Passo 2: Organização do Projeto
Para o site "puxar" seus projetos corretamente, mantenha os arquivos organizados assim:

app.py → O código principal do site.

requirements.txt → Lista de bibliotecas (gerada automaticamente).

assets/ → Pasta para suas fotos e prints dos projetos.

💻 Passo 3: Comandos de Execução
Aqui estão os comandos principais que você usará no dia a dia:

Para rodar o site localmente:

Bash

streamlit run app.py

Para gerar o arquivo de instalação (Hospedagem):
Se você for colocar o site na nuvem (Streamlit Cloud), você precisa dizer ao servidor o que instalar. Use este comando para criar o arquivo de lista:

Bash

pip freeze > requirements.txt

📑 Conteúdo do Site
O site foi distribuído em seções estratégicas para facilitar a leitura:

🏠 Home / Sobre Mim: Apresentação pessoal, formação e objetivos.

📂 Portfólio: Exibição dos projetos realizados com descrições e links.

📧 Contato: Espaço para conexões profissionais (LinkedIn/E-mail).
