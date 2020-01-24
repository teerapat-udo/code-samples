##########################################################
#Spam Filter using numpy and python
##########################################################

import math # To use log() function
import os
import random
import numpy.matlib 
import numpy as np 
from nltk.tokenize import word_tokenize 
from nltk.stem import PorterStemmer 
ps = PorterStemmer() 



f = open("stopword.txt", "r")
stopwordtxt = f.read()
stopwords = stopwordtxt.split(',')




rootdir = os.getcwd()

documentList = []

print("Organizing raw data...")
for directories, subdirs, files in os.walk(rootdir):
    if (os.path.split(directories)[1] == 'easy_ham' or os.path.split(directories)[1] == 'hard_ham'):
        for filename in files:
            with open(os.path.join(directories, filename), encoding="latin-1") as f:
                parsedData = []
                for line in f:
                    if line.find('Subject:')!= -1:
                        words=line.split()
                        for word in words:
                            word=word.lower()
                            word = ps.stem(word)
                            if word in stopwords:
                                continue
                            else:
                                parsedData.append(word)
                        documentList.append(("Ham", parsedData))
                        break

                    
    elif (os.path.split(directories)[1] == 'spam'):
        for filename in files:
            with open(os.path.join(directories, filename), encoding="latin-1") as f:
                parsedData = []
                for line in f:   
                    if line.find('Subject:')!= -1:
                        words=line.split()
                        for word in words:
                            word=word.lower()
                            word = ps.stem(word)
                            if word in stopwords:
                                continue
                            else:
                                parsedData.append(word)
                        documentList.append(("Spam", parsedData))
                        break
                    
print("")

print("Total # of documents = ", len(documentList))
print("")
#print (documentList)
TestingSet= documentList[3::4]
TrainingSet  = documentList
del TrainingSet[4-1::4]
print("training set length")
print(len(TrainingSet))
print("creating word list")
wordlist=[]
for j in range(0, len(TrainingSet)):
    words=TrainingSet[j][1]
    for word in words:
        word=word.lower()
        if word in wordlist:
            continue
        else:
            wordlist.append(word)
    



alpha=1
beta =2
spamcount=0
hamcount=0
totalcount=len(TrainingSet)
print("getting ham/spam counts in training set")
for j in range(0, len(TrainingSet)):
    if TrainingSet[j][0]=="Spam":
        spamcount=spamcount+1
    else:
        hamcount=hamcount+1
    

GivenHamProbs = []
GivenSpamProbs = []


print("calculating word given spam/Ham probabilities")
for word in wordlist:
    inhamcount=0
    inspamcount=0
    for doc in TrainingSet:
         if word in doc[1]:
            if doc[0]=="Ham":
                inhamcount=inhamcount+1
            else:
                inspamcount=inspamcount+1
    GivenHamProbs.append((word, (inhamcount+alpha)/(hamcount+beta)))
    GivenSpamProbs.append((word, (inspamcount+alpha)/(spamcount+beta)))



print("Precalculating Parameters")
ProbSpam=spamcount/totalcount
ProbHam=hamcount/totalcount
                 
threshold =.4

y0=0
z0=0
yvect=[]
zvect=[]
for word in wordlist:
    yvalue=[item for item in GivenSpamProbs if item[0] == word][0][1]
    y0=y0+math.log(1-yvalue)
    yvect.append(math.log(yvalue/(1-yvalue)))
    zvalue=[item for item in GivenHamProbs if item[0] == word][0][1]
    z0=z0+math.log(1-zvalue)
    zvect.append(math.log(zvalue/(1-zvalue)))







print("Getting top single word probabilities")
singlewordhamprobs=[]
singlewordspamprobs=[]
for word in wordlist:
    Spamvalue=[item for item in GivenSpamProbs if item[0] == word][0][1]
    Hamvalue = [item for item in GivenHamProbs if item[0] == word][0][1]
    probspam=(Spamvalue*ProbSpam)/((Spamvalue*ProbSpam)+(Hamvalue*ProbHam))
    probham=(Hamvalue*ProbHam)/((Hamvalue*ProbHam)+(Spamvalue*ProbSpam))
    singlewordhamprobs.append((word, probham))
    singlewordspamprobs.append((word, probspam))
    
singlewordhamprobs.sort(reverse=True,key = lambda x: x[1])
singlewordspamprobs.sort(reverse=True,key = lambda x: x[1])


print ("Top 5 Spam Words" )
for i in range(0, 5):
    print (singlewordspamprobs[i][0])
    print (singlewordspamprobs[i][1])

print ("Top 5 Ham Words" )
for i in range(0, 5):
    print (singlewordhamprobs[i][0])
    print (singlewordhamprobs[i][1])












print("Testing set length")
print(len(TestingSet))
print("Testing Classifier using precalculated parameters")
trueposcount=0
truenegcount=0
falseposcount=0
falsenegcount=0
totaltest=len(TestingSet)
for doc in TestingSet:
    docwordvect=[]
    for word in wordlist:
        if word in doc[1]:
            docwordvect.append(1)
        else:
            docwordvect.append(0)
    prob=(math.exp(np.dot(yvect,docwordvect)+y0)*ProbSpam)/((math.exp(np.dot(yvect,docwordvect)+y0)*ProbSpam)+(math.exp(np.dot(zvect,docwordvect)+z0)*ProbHam))
    if prob>threshold:
        result="Spam"
    else:
        result="Ham"
    if doc[0]=="Spam" and result == "Spam":
        trueposcount=trueposcount+1
    elif doc[0]=="Spam" and result == "Ham":
        falsenegcount=falsenegcount+1
    elif doc[0]=="Ham" and result == "Ham":
        truenegcount=truenegcount+1
    elif doc[0]=="Ham" and result == "Spam":
        falseposcount=falseposcount+1

accuracy=(trueposcount+truenegcount)/totaltest
precision=trueposcount/(trueposcount+falseposcount)
recall = trueposcount/(trueposcount+falsenegcount)



print("Accuracy")
print(accuracy)
print("Precision")
print(precision)
print("Recall")
print(recall)
                 
        






