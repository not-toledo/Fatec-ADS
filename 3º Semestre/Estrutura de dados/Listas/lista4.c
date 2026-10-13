
#include <stdio.h>
#include <string.h>

int main()
{
    char frase[200];
    char fraseConcatenada[250];
    char fraseAlterada[200];
    char fraseCifrada[200];
    int i;
    int caracteres;
    int vogais = 0;
    int consoantes = 0;
    int palavras = 0;

    printf("Digite uma frase: ");
    fgets(frase, 200, stdin);

    frase[strcspn(frase, "\n")] = '\0';

    caracteres = strlen(frase);

    printf("\nQuantidade de caracteres: %d\n", caracteres);

    for (i = 0; frase[i] != '\0'; i++)
    {
        if (frase[i] == 'a' || frase[i] == 'e' ||
            frase[i] == 'i' || frase[i] == 'o' ||
            frase[i] == 'u' ||
            frase[i] == 'A' || frase[i] == 'E' ||
            frase[i] == 'I' || frase[i] == 'O' ||
            frase[i] == 'U')
        {
            vogais++;
        }
        else if ((frase[i] >= 'a' && frase[i] <= 'z') ||
                 (frase[i] >= 'A' && frase[i] <= 'Z'))
        {
            consoantes++;
        }
    }

    printf("Quantidade de vogais: %d\n", vogais);
    printf("Quantidade de consoantes: %d\n", consoantes);

    for (i = 0; frase[i] != '\0'; i++)
    {
        if (frase[i] != ' ' &&
            (i == 0 || frase[i - 1] == ' '))
        {
            palavras++;
        }
    }

    printf("Quantidade de palavras: %d\n", palavras);

    strcpy(fraseConcatenada, frase);
    strcat(fraseConcatenada, " chuvanao");

    printf("Frase concatenada: %s\n", fraseConcatenada);

    strcpy(fraseAlterada, frase);

    for (i = 0; fraseAlterada[i] != '\0'; i++)
    {
        if (fraseAlterada[i] == 'a' ||
            fraseAlterada[i] == 'A' ||
            fraseAlterada[i] == 'i' ||
            fraseAlterada[i] == 'I')
        {
            fraseAlterada[i] = 'b';
        }
        else if (fraseAlterada[i] == 'e' ||
                 fraseAlterada[i] == 'E' ||
                 fraseAlterada[i] == 'o' ||
                 fraseAlterada[i] == 'O' ||
                 fraseAlterada[i] == 'u' ||
                 fraseAlterada[i] == 'U')
        {
            fraseAlterada[i] = '3';
        }
    }

    printf("Frase alterada: %s\n", fraseAlterada);

    strcpy(fraseCifrada, frase);

    for (i = 0; fraseCifrada[i] != '\0'; i++)
    {
        if (i < 5)
        {
            fraseCifrada[i] = fraseCifrada[i] + 3;
        }
        else
        {
            fraseCifrada[i] = fraseCifrada[i] - 5;
        }
    }

    printf("Frase original: %s\n", frase);
    printf("Frase concatenada: %s\n", fraseConcatenada);
    printf("Frase alterada por vogal: %s\n", fraseAlterada);
    printf("Frase cifrada: %s\n", fraseCifrada);

    return 0;
}
