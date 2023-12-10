import struct
import arabic_reshaper
from bidi.algorithm import get_display
import polars as pl
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, Dataset
import tkseem as tk
import numpy as np


def label_to_num(label):
    match label:
        case 'Positive':
            return 2
        case 'Negative':
            return 0
        case 'Neutral':
            return 1


def encode_string_to_array(byte_string):
    # Unpack the byte string into an array of integers
    # The 'B' format in struct.unpack means unsigned byte
    array = struct.unpack(f'{len(byte_string)}B', byte_string)
    return array


class FeedForwardSentimentClassifier(nn.Module):
    def __init__(self, len_unique_tokens, embedding_dim, max_tokens, hidden_layer_1_n, out_n):
        super().__init__()
        self.embedding_dim = embedding_dim
        self.max_tokens = max_tokens

        self.emb = nn.Embedding(num_embeddings=len_unique_tokens,
                                embedding_dim=self.embedding_dim,)
        self.fc1 = nn.Linear(300,
                             hidden_layer_1_n)
        self.fc2 = nn.Linear(hidden_layer_1_n,
                             hidden_layer_1_n // 2)
        self.fc3 = nn.Linear(hidden_layer_1_n // 2,
                             hidden_layer_1_n // 4)
        self.fc4 = nn.Linear(hidden_layer_1_n // 4,
                             out_n)

    def forward(self, x):
        x = self.emb(x)
        x = x.view((x.shape[0], self.max_tokens * self.embedding_dim))
        x = self.fc1(x)
        x = F.relu(x)
        x = self.fc2(x)
        x = F.relu(x)
        x = self.fc3(x)
        x = F.relu(x)
        x = self.fc4(x)
        return x


# model = FeedForwardSentimentClassifier(
#     len_unique_tokens=1000,
#     embedding_dim=6,
#     max_tokens=50,
#     hidden_layer_1_n=256,
#     out_n=3)
# model.load_state_dict(torch.load(
#     '/home/iyadelwy/Work/Bachelor/multi-modal-lab/backend/active_learning/model_params.pt'))


# torch.save(model.state_dict(
# ), '/home/iyadelwy/Work/Bachelor/multi-modal-lab/backend/active_learning/model_params.pt')

loss_func = nn.CrossEntropyLoss()


def train_on_item(item, model):

    optimizer = torch.optim.Adam(model.parameters(),
                                 lr=1e-2)

    sentence = item['data']['review_description']
    label = item['annotations'][0]['classes']
    x = torch.zeros((50), dtype=torch.long)
    for i, w in enumerate(encode_string_to_array(sentence.encode('utf-8'))):
        if i < 50:
            x[i] = w
    y = torch.tensor([label_to_num(label)])

    x = x.unsqueeze(0)
    # forward
    y_out = model(x)
    loss = loss_func(y_out, y)
    # backward & update
    loss.backward()
    optimizer.step()
    optimizer.zero_grad()
    model.load_state_dict(torch.load(
        '/home/iyadelwy/Work/Bachelor/multi-modal-lab/backend/active_learning/model_params.pt'))


def calculate_entropy(predictions):
    probabilities = F.softmax(predictions, dim=1)
    log_probabilities = F.log_softmax(predictions, dim=1)
    entropy = -(probabilities * log_probabilities).sum(dim=1)
    return entropy


def calculate_entropy_for_batch(batch, model):
    sents = []
    for idx, doc in enumerate(batch):
        s = doc['data']['review_description']
        if s:
            x = []
            for i, w in enumerate(encode_string_to_array(s.encode('utf-8'))):
                if i < 50:
                    x.append(w)
            for i in range(50 - len(x)):
                x.append(0)

            sents.append(x)

    xb = torch.tensor(sents)
    y_out = model(xb)
    return calculate_entropy(y_out).mean(dim=0).item()
